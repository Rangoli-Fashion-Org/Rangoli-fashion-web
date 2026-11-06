import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { OptionalJwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(OptionalJwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(
    @CurrentUser('id') userId?: string,
    @Query('sessionId') sessionId?: string,
  ) {
    return this.wishlistService.getWishlist(userId, sessionId);
  }

  @Post('toggle')
  toggleItem(
    @CurrentUser('id') userId: string | undefined,
    @Body('productId') productId: string,
    @Body('sessionId') sessionId?: string,
  ) {
    return this.wishlistService.toggleItem(userId, sessionId, productId);
  }
}
