import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new BadRequestException('User ID or Session ID required for cart');
    }

    let cart = await this.prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { orderBy: { displayOrder: 'asc' } } },
            },
            variant: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId: userId || null,
          sessionId: !userId ? sessionId : null,
        },
        include: {
          items: {
            include: {
              product: {
                include: { images: { orderBy: { displayOrder: 'asc' } } },
              },
              variant: true,
            },
          },
        },
      });
    }

    return this.calculateCartTotals(cart);
  }

  async addItem(userId: string | undefined, sessionId: string | undefined, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: { variants: true },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product is not available');
    }

    let unitPrice = Number(product.salePrice || product.regularPrice);
    let availableStock = product.stockQuantity;

    if (dto.variantId) {
      const variant = product.variants.find((v) => v.id === dto.variantId);
      if (!variant || !variant.isActive) {
        throw new BadRequestException('Selected variant is unavailable');
      }
      if (variant.priceOverride) {
        unitPrice = Number(variant.priceOverride);
      }
      availableStock = variant.stockQuantity;
    }

    if (availableStock < dto.quantity) {
      throw new BadRequestException(`Only ${availableStock} items in stock`);
    }

    // Ensure cart exists
    let cart = await this.prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId: userId || null,
          sessionId: !userId ? sessionId : null,
        },
      });
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: dto.productId,
        variantId: dto.variantId || null,
      },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + dto.quantity;
      if (newQty > availableStock) {
        throw new BadRequestException(`Cannot add more than ${availableStock} items in stock`);
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQty,
          unitPrice: new Prisma.Decimal(unitPrice),
        },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          variantId: dto.variantId || null,
          quantity: dto.quantity,
          unitPrice: new Prisma.Decimal(unitPrice),
        },
      });
    }

    return this.getCart(userId, sessionId);
  }

  async updateItemQuantity(
    userId: string | undefined,
    sessionId: string | undefined,
    itemId: string,
    dto: UpdateCartItemDto,
  ) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true, variant: true },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const availableStock = cartItem.variant
      ? cartItem.variant.stockQuantity
      : cartItem.product.stockQuantity;

    if (dto.quantity > availableStock) {
      throw new BadRequestException(`Only ${availableStock} items available in stock`);
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });

    return this.getCart(userId, sessionId);
  }

  async removeItem(userId: string | undefined, sessionId: string | undefined, itemId: string) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (cartItem) {
      await this.prisma.cartItem.delete({
        where: { id: itemId },
      });
    }

    return this.getCart(userId, sessionId);
  }

  async mergeGuestCart(userId: string, sessionId: string) {
    const guestCart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) {
      return this.getCart(userId);
    }

    let userCart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!userCart) {
      // Transfer guest cart to user
      await this.prisma.cart.update({
        where: { id: guestCart.id },
        data: { userId, sessionId: null },
      });
      return this.getCart(userId);
    }

    // Merge items into userCart
    for (const item of guestCart.items) {
      const existing = await this.prisma.cartItem.findFirst({
        where: {
          cartId: userCart.id,
          productId: item.productId,
          variantId: item.variantId,
        },
      });

      if (existing) {
        await this.prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + item.quantity },
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          },
        });
      }
    }

    await this.prisma.cart.delete({ where: { id: guestCart.id } });
    return this.getCart(userId);
  }

  async applyCoupon(userId: string | undefined, sessionId: string | undefined, code: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      throw new BadRequestException('Invalid or expired coupon code');
    }

    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      throw new BadRequestException('Coupon code has expired');
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    const cart = await this.prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { couponCode: coupon.code },
    });

    return this.getCart(userId, sessionId);
  }

  async removeCoupon(userId: string | undefined, sessionId: string | undefined) {
    const cart = await this.prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (cart) {
      await this.prisma.cart.update({
        where: { id: cart.id },
        data: { couponCode: null },
      });
    }

    return this.getCart(userId, sessionId);
  }

  private async calculateCartTotals(cart: any) {
    let subtotal = 0;
    const formattedItems = cart.items.map((item: any) => {
      const price = Number(item.unitPrice);
      const lineTotal = price * item.quantity;
      subtotal += lineTotal;
      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: price,
        lineTotal,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          sku: item.product.sku,
          regularPrice: Number(item.product.regularPrice),
          salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
          images: item.product.images,
        },
        variant: item.variant ? {
          id: item.variant.id,
          sku: item.variant.sku,
          size: item.variant.size,
          color: item.variant.color,
          stockQuantity: item.variant.stockQuantity,
        } : null,
      };
    });

    // Check free shipping threshold (default 1999 from reference design)
    const thresholdSetting = await this.prisma.storeSetting.findUnique({
      where: { key: 'free_shipping_threshold' },
    });
    const freeShippingThreshold = thresholdSetting ? parseFloat(thresholdSetting.value) : 1999;
    const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;

    let discountAmount = 0;
    if (cart.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: cart.couponCode },
      });
      if (coupon && coupon.isActive) {
        if (!coupon.minOrderValue || subtotal >= Number(coupon.minOrderValue)) {
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
            if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
              discountAmount = Number(coupon.maxDiscount);
            }
          } else {
            discountAmount = Number(coupon.discountValue);
          }
        }
      }
    }

    const total = Math.max(0, subtotal - discountAmount + shippingFee);

    return {
      id: cart.id,
      userId: cart.userId,
      sessionId: cart.sessionId,
      couponCode: cart.couponCode,
      items: formattedItems,
      itemCount: formattedItems.reduce((acc: number, item: any) => acc + item.quantity, 0),
      subtotal,
      discountAmount,
      shippingFee,
      freeShippingThreshold,
      freeShippingRemaining: Math.max(0, freeShippingThreshold - subtotal),
      total,
    };
  }
}

