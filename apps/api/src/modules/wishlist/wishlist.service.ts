import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async getWishlist(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new BadRequestException('User ID or Session ID required for wishlist');
    }

    let wishlist = await this.prisma.wishlist.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { displayOrder: 'asc' } },
                category: true,
                variants: true,
              },
            },
          },
        },
      },
    });

    if (!wishlist) {
      wishlist = await this.prisma.wishlist.create({
        data: {
          userId: userId || null,
          sessionId: !userId ? sessionId : null,
        },
        include: { items: { include: { product: { include: { images: true, category: true, variants: true } } } } },
      });
    }

    return {
      id: wishlist.id,
      items: wishlist.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        product: {
          ...item.product,
          regularPrice: Number(item.product.regularPrice),
          salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
        },
      })),
    };
  }

  async toggleItem(userId: string | undefined, sessionId: string | undefined, productId: string) {
    let wishlist = await this.prisma.wishlist.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (!wishlist) {
      wishlist = await this.prisma.wishlist.create({
        data: {
          userId: userId || null,
          sessionId: !userId ? sessionId : null,
        },
      });
    }

    const existingItem = await this.prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId,
      },
    });

    if (existingItem) {
      await this.prisma.wishlistItem.delete({
        where: { id: existingItem.id },
      });
      return { added: false, message: 'Removed from wishlist' };
    } else {
      await this.prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
        },
      });
      return { added: true, message: 'Added to wishlist' };
    }
  }
}

