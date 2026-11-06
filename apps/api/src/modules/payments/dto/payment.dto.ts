import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRazorpayOrderDto {
  @IsString()
  @IsNotEmpty()
  orderId!: string;
}

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId!: string;

  @IsString()
  @IsNotEmpty()
  razorpayOrderId!: string;

  @IsString()
  @IsNotEmpty()
  razorpayPaymentId!: string;

  @IsString()
  @IsNotEmpty()
  razorpaySignature!: string;
}
