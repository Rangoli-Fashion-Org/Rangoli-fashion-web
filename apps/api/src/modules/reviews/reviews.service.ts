import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface CreateReviewDto {
  productId: string;
  authorName: string;
  rating: number;
  comment: string;
}

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId, isApproved: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string | undefined, dto: CreateReviewDto) {
    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.review.create({
      data: {
        productId: dto.productId,
        userId: userId || null,
        authorName: dto.authorName,
        rating: dto.rating,
        comment: dto.comment,
        isApproved: false, // Moderated by default
      },
    });
  }

  // Admin Methods
  async adminFindAll(isApproved?: boolean) {
    const where = isApproved !== undefined ? { isApproved } : {};
    return this.prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { id: true, name: true, sku: true } },
        user: { select: { id: true, email: true, fullName: true } },
      },
    });
  }

  async adminSetApproval(id: string, isApproved: boolean) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.review.update({
      where: { id },
      data: { isApproved },
    });
  }

  async delete(id: string) {
    await this.prisma.review.delete({ where: { id } });
    return { success: true, message: 'Review deleted' };
  }
}

