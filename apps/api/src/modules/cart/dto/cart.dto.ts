import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsString()
  @IsOptional()
  variantId?: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsString()
  @IsOptional()
  sessionId?: string;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsString()
  @IsOptional()
  sessionId?: string;
}

export class ApplyCouponDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsOptional()
  sessionId?: string;
}

