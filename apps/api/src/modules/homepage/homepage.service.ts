import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface SectionUpdateDto {
  title?: string;
  subtitle?: string;
  displayOrder?: number;
  isVisible?: boolean;
  customData?: any;
}

@Injectable()
export class HomepageService {
  constructor(private readonly prisma: PrismaService) {}

  async getLayout() {
    return this.prisma.homepageSection.findMany({
      where: { isVisible: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async adminGetAll() {
    return this.prisma.homepageSection.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  async updateSection(id: string, dto: SectionUpdateDto) {
    const section = await this.prisma.homepageSection.findUnique({ where: { id } });
    if (!section) {
      throw new NotFoundException('Section not found');
    }

    return this.prisma.homepageSection.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.subtitle !== undefined ? { subtitle: dto.subtitle } : {}),
        ...(dto.displayOrder !== undefined ? { displayOrder: dto.displayOrder } : {}),
        ...(dto.isVisible !== undefined ? { isVisible: dto.isVisible } : {}),
        ...(dto.customData !== undefined ? { customData: dto.customData } : {}),
      },
    });
  }
}
