import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto, ApplyCouponDto } from './dto/cart.dto';
import { OptionalJwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Request } from 'express';

@UseGuards(OptionalJwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(
    @CurrentUser('id') userId?: string,
    @Query('sessionId') sessionId?: string,
  ) {
    return this.cartService.getCart(userId, sessionId);
  }

  @Post('items')
  addItem(
    @CurrentUser('id') userId: string | undefined,
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addItem(userId, dto.sessionId, dto);
  }

  @Put('items/:id')
  updateItemQuantity(
    @Param('id') itemId: string,
    @CurrentUser('id') userId: string | undefined,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(userId, dto.sessionId, itemId, dto);
  }

  @Delete('items/:id')
  removeItem(
    @Param('id') itemId: string,
    @CurrentUser('id') userId: string | undefined,
    @Query('sessionId') sessionId?: string,
  ) {
    return this.cartService.removeItem(userId, sessionId, itemId);
  }

  @Post('merge')
  mergeGuestCart(
    @CurrentUser('id') userId: string,
    @Body('sessionId') sessionId: string,
  ) {
    return this.cartService.mergeGuestCart(userId, sessionId);
  }

  @Post('coupon')
  applyCoupon(
    @CurrentUser('id') userId: string | undefined,
    @Body() dto: ApplyCouponDto,
  ) {
    return this.cartService.applyCoupon(userId, dto.sessionId, dto.code);
  }

  @Delete('coupon')
  removeCoupon(
    @CurrentUser('id') userId: string | undefined,
    @Query('sessionId') sessionId?: string,
  ) {
    return this.cartService.removeCoupon(userId, sessionId);
  }
}

