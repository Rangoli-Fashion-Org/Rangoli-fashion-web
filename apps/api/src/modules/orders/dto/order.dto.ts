import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '../../users/dto/address.dto';
import { OrderStatus, PaymentMethod } from '@prisma/client';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsString()
  @IsNotEmpty()
  userEmail!: string;

  @IsString()
  @IsNotEmpty()
  customerPhone!: string;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  shippingAddress!: CreateAddressDto;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsString()
  @IsOptional()
  sessionId?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @IsString()
  @IsOptional()
  trackingCourier?: string;
}
