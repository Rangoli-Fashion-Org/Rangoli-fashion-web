import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DiscountType, Prisma } from '@prisma/client';

export interface CouponDto {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  expiryDate?: string;
  usageLimit?: number;
  isActive?: boolean;
}

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { usages: true } },
      },
    });
  }

  async findOne(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: { usages: { include: { user: true, order: true } } },
    });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async create(dto: CouponDto) {
    const code = dto.code.toUpperCase().trim();
    const existing = await this.prisma.coupon.findUnique({ where: { code } });
    if (existing) throw new ConflictException(`Coupon code "${code}" already exists`);

    return this.prisma.coupon.create({
      data: {
        code,
        description: dto.description || null,
        discountType: dto.discountType,
        discountValue: new Prisma.Decimal(dto.discountValue),
        minOrderValue: dto.minOrderValue ? new Prisma.Decimal(dto.minOrderValue) : null,
        maxDiscount: dto.maxDiscount ? new Prisma.Decimal(dto.maxDiscount) : null,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
        usageLimit: dto.usageLimit || null,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async update(id: string, dto: Partial<CouponDto>) {
    const existing = await this.prisma.coupon.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Coupon not found');

    return this.prisma.coupon.update({
      where: { id },
      data: {
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.discountType ? { discountType: dto.discountType } : {}),
        ...(dto.discountValue !== undefined ? { discountValue: new Prisma.Decimal(dto.discountValue) } : {}),
        ...(dto.minOrderValue !== undefined ? { minOrderValue: dto.minOrderValue ? new Prisma.Decimal(dto.minOrderValue) : null } : {}),
        ...(dto.maxDiscount !== undefined ? { maxDiscount: dto.maxDiscount ? new Prisma.Decimal(dto.maxDiscount) : null } : {}),
        ...(dto.expiryDate !== undefined ? { expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null } : {}),
        ...(dto.usageLimit !== undefined ? { usageLimit: dto.usageLimit } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
    });
  }

  async delete(id: string) {
    await this.prisma.coupon.delete({ where: { id } });
    return { success: true, message: 'Coupon deleted' };
  }
}
