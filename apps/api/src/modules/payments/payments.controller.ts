import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateRazorpayOrderDto, VerifyPaymentDto } from './dto/payment.dto';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('razorpay/create-order')
  createRazorpayOrder(@Body() dto: CreateRazorpayOrderDto) {
    return this.paymentsService.createRazorpayOrder(dto);
  }

  @Post('razorpay/verify')
  @HttpCode(HttpStatus.OK)
  verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(dto);
  }

  @Post('razorpay/webhook')
  @HttpCode(HttpStatus.OK)
  handleWebhook(
    @Headers('x-razorpay-signature') signature: string,
    @Body() payload: any,
    @Req() req: Request,
  ) {
    const rawBody = (req as any).rawBody || JSON.stringify(payload);
    return this.paymentsService.processWebhook(signature, payload, rawBody);
  }
}

