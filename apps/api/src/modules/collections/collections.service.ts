import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { generateSlug } from '@rangoli/validation';

export interface CollectionDto {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublic() {
    return this.prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });
  }

  async adminFindAll() {
    return this.prisma.collection.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  async findOneBySlug(slug: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          include: { images: true, variants: true },
        },
      },
    });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    return collection;
  }

  async create(dto: CollectionDto) {
    const slug = dto.slug ? generateSlug(dto.slug) : generateSlug(dto.name);
    const existing = await this.prisma.collection.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Collection with slug "${slug}" already exists`);
    }

    return this.prisma.collection.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description || null,
        imageUrl: dto.imageUrl || null,
        displayOrder: dto.displayOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async update(id: string, dto: Partial<CollectionDto>) {
    const existing = await this.prisma.collection.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Collection not found');
    }

    const slug = dto.slug ? generateSlug(dto.slug) : (dto.name ? generateSlug(dto.name) : existing.slug);

    return this.prisma.collection.update({
      where: { id },
      data: {
        ...(dto.name ? { name: dto.name } : {}),
        ...(slug ? { slug } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl } : {}),
        ...(dto.displayOrder !== undefined ? { displayOrder: dto.displayOrder } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.collection.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Collection not found');
    }
    await this.prisma.collection.delete({ where: { id } });
    return { success: true, message: 'Collection deleted' };
  }
}
