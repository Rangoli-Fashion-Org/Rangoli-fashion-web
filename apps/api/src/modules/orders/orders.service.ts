import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { CartService } from '../cart/cart.service';
import { OrderStatus, PaymentStatus, InventoryMovementType, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
  ) {}

  async createOrder(userId: string | undefined, dto: CreateOrderDto) {
    const cart = await this.cartService.getCart(userId, dto.sessionId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Your shopping cart is empty');
    }

    const orderNumber = `RF-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    return this.prisma.$transaction(async (tx) => {
      // 1. Verify stock and calculate final figures
      for (const item of cart.items) {
        if (item.variantId) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
          });
          if (!variant || variant.stockQuantity < item.quantity) {
            throw new BadRequestException(`Variant ${variant?.sku || ''} is out of stock`);
          }

          // Decrement variant stock
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stockQuantity: { decrement: item.quantity } },
          });

          // Decrement product total stock
          await tx.product.update({
            where: { id: item.productId },
            data: { stockQuantity: { decrement: item.quantity } },
          });

          // Log inventory movement
          await tx.inventoryMovement.create({
            data: {
              productId: item.productId,
              variantId: item.variantId,
              type: InventoryMovementType.SALE,
              quantity: -item.quantity,
              previousStock: variant.stockQuantity,
              newStock: variant.stockQuantity - item.quantity,
              reason: `Order ${orderNumber}`,
            },
          });
        } else {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });
          if (!product || product.stockQuantity < item.quantity) {
            throw new BadRequestException(`Product ${product?.name || ''} is out of stock`);
          }

          await tx.product.update({
            where: { id: item.productId },
            data: { stockQuantity: { decrement: item.quantity } },
          });

          await tx.inventoryMovement.create({
            data: {
              productId: item.productId,
              type: InventoryMovementType.SALE,
              quantity: -item.quantity,
              previousStock: product.stockQuantity,
              newStock: product.stockQuantity - item.quantity,
              reason: `Order ${orderNumber}`,
            },
          });
        }
      }

      // 2. Create the order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || null,
          userEmail: dto.userEmail,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          shippingAddressJson: dto.shippingAddress as any,
          subtotal: new Prisma.Decimal(cart.subtotal),
          shippingFee: new Prisma.Decimal(cart.shippingFee),
          discountAmount: new Prisma.Decimal(cart.discountAmount),
          totalAmount: new Prisma.Decimal(cart.total),
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          paymentMethod: dto.paymentMethod,
          notes: dto.notes || null,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId || null,
              productName: item.product.name,
              sku: item.variant ? item.variant.sku : item.product.sku,
              variantDescription: item.variant
                ? `Size: ${item.variant.size}, Color: ${item.variant.color}`
                : null,
              unitPrice: new Prisma.Decimal(item.unitPrice),
              quantity: item.quantity,
              totalPrice: new Prisma.Decimal(item.lineTotal),
              imageUrl: item.product.images?.[0]?.url || null,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 3. Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // 4. Update coupon usage if applicable
      if (cart.couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: cart.couponCode },
        });
        if (coupon) {
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usageCount: { increment: 1 } },
          });
          await tx.couponUsage.create({
            data: {
              couponId: coupon.id,
              userId: userId || null,
              orderId: order.id,
              discountApplied: new Prisma.Decimal(cart.discountAmount),
            },
          });
        }
      }

      return order;
    });
  }

  async findUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    });
  }

  async findOrderById(orderId: string, userId?: string) {
    const where: Prisma.OrderWhereInput = { id: orderId };
    if (userId) where.userId = userId;

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: true,
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findOrderByNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // Admin Methods
  async adminFindAll(query: { status?: OrderStatus; search?: string; page?: string; limit?: string }) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search, mode: 'insensitive' } },
        { customerName: { contains: query.search, mode: 'insensitive' } },
        { userEmail: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          payments: true,
        },
      }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async adminUpdateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // If cancelling, restore inventory
    if (dto.status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
      for (const item of order.items) {
        if (item.variantId) {
          await this.prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stockQuantity: { increment: item.quantity } },
          });
        }
        await this.prisma.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity } },
        });

        await this.prisma.inventoryMovement.create({
          data: {
            productId: item.productId,
            variantId: item.variantId,
            type: InventoryMovementType.RETURN,
            quantity: item.quantity,
            previousStock: 0,
            newStock: item.quantity,
            reason: `Order ${order.orderNumber} cancelled`,
          },
        });
      }
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: dto.status,
        trackingNumber: dto.trackingNumber || order.trackingNumber,
        trackingCourier: dto.trackingCourier || order.trackingCourier,
      },
    });
  }
}

