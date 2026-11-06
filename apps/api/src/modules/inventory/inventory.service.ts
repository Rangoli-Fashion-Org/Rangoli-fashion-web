import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { InventoryMovementType } from '@prisma/client';

export interface StockAdjustmentDto {
  productId: string;
  variantId?: string;
  adjustment: number; // positive or negative
  type: InventoryMovementType;
  reason?: string;
}

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getInventorySummary() {
    const products = await this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        stockQuantity: true,
        variants: {
          select: {
            id: true,
            sku: true,
            size: true,
            color: true,
            stockQuantity: true,
          },
        },
      },
      orderBy: { stockQuantity: 'asc' },
    });

    const lowStockItems = products.filter((p) => p.stockQuantity <= 5);

    return {
      totalProducts: products.length,
      lowStockCount: lowStockItems.length,
      products,
    };
  }

  async getMovements(productId?: string) {
    const where = productId ? { productId } : {};
    return this.prisma.inventoryMovement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        product: { select: { id: true, name: true, sku: true } },
        variant: { select: { id: true, sku: true, size: true, color: true } },
      },
    });
  }

  async adjustStock(dto: StockAdjustmentDto) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.variantId) {
        const variant = await tx.productVariant.findUnique({
          where: { id: dto.variantId },
        });
        if (!variant) throw new NotFoundException('Variant not found');

        const newStock = variant.stockQuantity + dto.adjustment;
        if (newStock < 0) {
          throw new BadRequestException('Stock quantity cannot be negative');
        }

        await tx.productVariant.update({
          where: { id: dto.variantId },
          data: { stockQuantity: newStock },
        });

        // Also adjust main product stock
        await tx.product.update({
          where: { id: dto.productId },
          data: { stockQuantity: { increment: dto.adjustment } },
        });

        const movement = await tx.inventoryMovement.create({
          data: {
            productId: dto.productId,
            variantId: dto.variantId,
            type: dto.type || InventoryMovementType.ADJUSTMENT,
            quantity: dto.adjustment,
            previousStock: variant.stockQuantity,
            newStock,
            reason: dto.reason || 'Manual stock adjustment',
          },
        });

        return { success: true, newStock, movement };
      } else {
        const product = await tx.product.findUnique({
          where: { id: dto.productId },
        });
        if (!product) throw new NotFoundException('Product not found');

        const newStock = product.stockQuantity + dto.adjustment;
        if (newStock < 0) {
          throw new BadRequestException('Stock quantity cannot be negative');
        }

        await tx.product.update({
          where: { id: dto.productId },
          data: { stockQuantity: newStock },
        });

        const movement = await tx.inventoryMovement.create({
          data: {
            productId: dto.productId,
            type: dto.type || InventoryMovementType.ADJUSTMENT,
            quantity: dto.adjustment,
            previousStock: product.stockQuantity,
            newStock,
            reason: dto.reason || 'Manual stock adjustment',
          },
        });

        return { success: true, newStock, movement };
      }
    });
  }
}

