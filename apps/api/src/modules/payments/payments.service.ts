import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { CreateRazorpayOrderDto, VerifyPaymentDto } from './dto/payment.dto';
import { PaymentStatus, OrderStatus, PaymentMethod } from '@prisma/client';
import * as crypto from 'crypto';
const Razorpay = require('razorpay');

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private razorpayInstance: any = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (keyId && keySecret) {
      this.razorpayInstance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
      this.logger.log('Razorpay initialized successfully');
    } else {
      this.logger.warn('Razorpay credentials not fully configured in environment');
    }
  }

  async createRazorpayOrder(dto: CreateRazorpayOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Order has already been paid');
    }

    const amountInPaise = Math.round(Number(order.totalAmount) * 100);

    if (!this.razorpayInstance) {
      // In development when keys are empty, generate valid payment order reference
      const mockRazorpayOrderId = `order_${crypto.randomBytes(10).toString('hex')}`;
      await this.prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: mockRazorpayOrderId },
      });

      return {
        key: this.configService.get<string>('RAZORPAY_KEY_ID') || 'rzp_test_placeholder',
        amount: amountInPaise,
        currency: 'INR',
        name: 'Rangoli Fashions',
        description: `Order #${order.orderNumber}`,
        order_id: mockRazorpayOrderId,
        customer: {
          name: order.customerName,
          email: order.userEmail,
          contact: order.customerPhone,
        },
      };
    }

    try {
      const razorpayOrder = await this.razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: order.orderNumber,
        notes: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
      });

      await this.prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: razorpayOrder.id },
      });

      return {
        key: this.configService.get<string>('RAZORPAY_KEY_ID'),
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Rangoli Fashions',
        description: `Order #${order.orderNumber}`,
        order_id: razorpayOrder.id,
        customer: {
          name: order.customerName,
          email: order.userEmail,
          contact: order.customerPhone,
        },
      };
    } catch (error: any) {
      this.logger.error('Failed to create Razorpay order', error);
      throw new BadRequestException(`Failed to initialize payment: ${error.message}`);
    }
  }

  async verifyPayment(dto: VerifyPaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (keySecret) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== dto.razorpaySignature) {
        // Record failed attempt
        await this.prisma.payment.create({
          data: {
            orderId: order.id,
            paymentMethod: PaymentMethod.RAZORPAY,
            status: PaymentStatus.FAILED,
            amount: order.totalAmount,
            razorpayOrderId: dto.razorpayOrderId,
            razorpayPaymentId: dto.razorpayPaymentId,
            razorpaySignature: dto.razorpaySignature,
            errorReason: 'Payment signature verification failed',
          },
        });
        throw new BadRequestException('Invalid payment signature');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // Create payment record
      await tx.payment.create({
        data: {
          orderId: order.id,
          paymentMethod: PaymentMethod.RAZORPAY,
          status: PaymentStatus.PAID,
          amount: order.totalAmount,
          razorpayOrderId: dto.razorpayOrderId,
          razorpayPaymentId: dto.razorpayPaymentId,
          razorpaySignature: dto.razorpaySignature,
        },
      });

      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.CONFIRMED,
          razorpayPaymentId: dto.razorpayPaymentId,
        },
        include: { items: true },
      });

      return {
        success: true,
        message: 'Payment verified and order confirmed successfully',
        order: updatedOrder,
      };
    });
  }

  async processWebhook(signature: string, payload: any, rawBody: string) {
    const webhookSecret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET');

    if (webhookSecret) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        throw new BadRequestException('Invalid webhook signature');
      }
    }

    const eventId = payload?.event_id || payload?.id || `evt_${Date.now()}`;
    const eventType = payload?.event;

    // Idempotency check
    const existingEvent = await this.prisma.paymentWebhookEvent.findUnique({
      where: { eventId },
    });

    if (existingEvent && existingEvent.processed) {
      return { status: 'already_processed' };
    }

    const webhookRecord = await this.prisma.paymentWebhookEvent.upsert({
      where: { eventId },
      update: {},
      create: {
        eventId,
        eventType,
        payload: payload as any,
      },
    });

    try {
      if (eventType === 'payment.captured' || eventType === 'order.paid') {
        const paymentEntity = payload.payload?.payment?.entity;
        const razorpayOrderId = paymentEntity?.order_id;
        const razorpayPaymentId = paymentEntity?.id;

        if (razorpayOrderId) {
          const order = await this.prisma.order.findUnique({
            where: { razorpayOrderId },
          });

          if (order && order.paymentStatus !== PaymentStatus.PAID) {
            await this.prisma.order.update({
              where: { id: order.id },
              data: {
                paymentStatus: PaymentStatus.PAID,
                status: OrderStatus.CONFIRMED,
                razorpayPaymentId,
              },
            });
          }
        }
      }

      await this.prisma.paymentWebhookEvent.update({
        where: { id: webhookRecord.id },
        data: {
          processed: true,
          processedAt: new Date(),
        },
      });

      return { status: 'success' };
    } catch (err: any) {
      this.logger.error(`Webhook processing failed for event ${eventId}:`, err);
      throw err;
    }
  }
}

