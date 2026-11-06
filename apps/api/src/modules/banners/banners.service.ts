import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface BannerDto {
  title: string;
  subtitle?: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}

  async findActive() {
    return this.prisma.heroBanner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async adminFindAll() {
    return this.prisma.heroBanner.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  async create(dto: BannerDto) {
    return this.prisma.heroBanner.create({
      data: {
        title: dto.title,
        subtitle: dto.subtitle || null,
        desktopImageUrl: dto.desktopImageUrl,
        mobileImageUrl: dto.mobileImageUrl || null,
        ctaText: dto.ctaText || 'Shop the Collection',
        ctaUrl: dto.ctaUrl || '/shop',
        displayOrder: dto.displayOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async update(id: string, dto: Partial<BannerDto>) {
    const banner = await this.prisma.heroBanner.findUnique({ where: { id } });
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    return this.prisma.heroBanner.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    const banner = await this.prisma.heroBanner.findUnique({ where: { id } });
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    await this.prisma.heroBanner.delete({ where: { id } });
    return { success: true, message: 'Banner deleted' };
  }
}
