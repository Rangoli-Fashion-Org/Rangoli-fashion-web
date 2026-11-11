import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from './dto/product.dto';
import { generateSlug, calculateDiscount } from '@rangoli/validation';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(query.limit || '12', 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (query.category) {
      where.OR = [
        { category: { slug: query.category } },
        { categoryId: query.category },
      ];
    }

    if (query.collection) {
      where.collection = { slug: query.collection };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.minPrice || query.maxPrice) {
      const priceFilter: Prisma.DecimalFilter = {};
      if (query.minPrice) priceFilter.gte = new Prisma.Decimal(query.minPrice);
      if (query.maxPrice) priceFilter.lte = new Prisma.Decimal(query.maxPrice);
      where.regularPrice = priceFilter;
    }

    if (query.inStock === 'true') {
      where.stockQuantity = { gt: 0 };
    }

    if (query.size) {
      where.variants = {
        some: {
          size: { equals: query.size, mode: 'insensitive' },
          stockQuantity: { gt: 0 },
        },
      };
    }

    if (query.color) {
      where.variants = {
        some: {
          color: { equals: query.color, mode: 'insensitive' },
        },
      };
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    switch (query.sort) {
      case 'price_asc':
        orderBy = { regularPrice: 'asc' };
        break;
      case 'price_desc':
        orderBy = { regularPrice: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'popularity':
      case 'best_rated':
        orderBy = { createdAt: 'desc' }; // or review aggregations
        break;
    }

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          images: { orderBy: { displayOrder: 'asc' } },
          category: { select: { id: true, name: true, slug: true } },
          collection: { select: { id: true, name: true, slug: true } },
          variants: true,
          reviews: {
            where: { isApproved: true },
            select: { rating: true },
          },
        },
      }),
    ]);

    const formatted = products.map((p) => {
      const ratingSum = p.reviews.reduce((acc, r) => acc + r.rating, 0);
      const averageRating = p.reviews.length > 0 ? Number((ratingSum / p.reviews.length).toFixed(1)) : 0;

      return {
        ...p,
        regularPrice: Number(p.regularPrice),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        averageRating,
        reviewCount: p.reviews.length,
        reviews: undefined,
      };
    });

    return {
      data: formatted,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findNewArrivals(limit = 8) {
    const products = await this.prisma.product.findMany({
      where: { isActive: true, isNewArrival: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        category: { select: { id: true, name: true, slug: true } },
        variants: true,
        reviews: {
          where: { isApproved: true },
          select: { rating: true },
        },
      },
    });

    return products.map((p) => {
      const ratingSum = p.reviews.reduce((acc, r) => acc + r.rating, 0);
      const averageRating = p.reviews.length > 0 ? Number((ratingSum / p.reviews.length).toFixed(1)) : 0;
      return {
        ...p,
        regularPrice: Number(p.regularPrice),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        averageRating,
        reviewCount: p.reviews.length,
        reviews: undefined,
      };
    });
  }

  async findBestSellers(limit = 8) {
    let products = await this.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        category: { select: { id: true, name: true, slug: true } },
        variants: true,
        reviews: {
          where: { isApproved: true },
          select: { rating: true },
        },
      },
    });

    if (products.length < limit) {
      const existingIds = products.map((p) => p.id);
      const additional = await this.prisma.product.findMany({
        where: {
          isActive: true,
          id: { notIn: existingIds },
        },
        take: limit - products.length,
        orderBy: { createdAt: 'desc' },
        include: {
          images: { orderBy: { displayOrder: 'asc' } },
          category: { select: { id: true, name: true, slug: true } },
          variants: true,
          reviews: {
            where: { isApproved: true },
            select: { rating: true },
          },
        },
      });
      products = [...products, ...additional];
    }

    return products.map((p) => {
      const ratingSum = p.reviews.reduce((acc, r) => acc + r.rating, 0);
      const averageRating = p.reviews.length > 0 ? Number((ratingSum / p.reviews.length).toFixed(1)) : 0;
      return {
        ...p,
        regularPrice: Number(p.regularPrice),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        averageRating,
        reviewCount: p.reviews.length,
        reviews: undefined,
      };
    });
  }

  async findOneBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        category: true,
        collection: true,
        brand: true,
        variants: {
          where: { isActive: true },
          orderBy: { sku: 'asc' },
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found or unavailable');
    }

    const ratingSum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = product.reviews.length > 0 ? Number((ratingSum / product.reviews.length).toFixed(1)) : 0;

    return {
      ...product,
      regularPrice: Number(product.regularPrice),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      variants: product.variants.map((v) => ({
        ...v,
        priceOverride: v.priceOverride ? Number(v.priceOverride) : null,
      })),
      averageRating,
      reviewCount: product.reviews.length,
    };
  }

  // Admin Methods
  async adminFindAll(query: ProductQueryDto) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.categoryId = query.category;
    }

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          images: { orderBy: { displayOrder: 'asc' } },
          category: true,
          collection: true,
          variants: true,
        },
      }),
    ]);

    return {
      data: products.map((p) => ({
        ...p,
        regularPrice: Number(p.regularPrice),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async adminFindOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        category: true,
        collection: true,
        brand: true,
        variants: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      ...product,
      regularPrice: Number(product.regularPrice),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      variants: product.variants.map((v) => ({
        ...v,
        priceOverride: v.priceOverride ? Number(v.priceOverride) : null,
      })),
    };
  }

  async create(dto: CreateProductDto) {
    const slug = dto.slug ? generateSlug(dto.slug) : generateSlug(dto.name);

    const existingSku = await this.prisma.product.findUnique({
      where: { sku: dto.sku },
    });
    if (existingSku) {
      throw new ConflictException(`SKU "${dto.sku}" already exists`);
    }

    const existingSlug = await this.prisma.product.findUnique({
      where: { slug },
    });
    const finalSlug = existingSlug ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const discountPercentage = calculateDiscount(dto.regularPrice, dto.salePrice);

    let totalStock = dto.stockQuantity ?? 0;
    if (dto.variants && dto.variants.length > 0) {
      totalStock = dto.variants.reduce((acc, v) => acc + (v.stockQuantity || 0), 0);
    }

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: dto.name,
          slug: finalSlug,
          sku: dto.sku,
          description: dto.description,
          shortDescription: dto.shortDescription || null,
          regularPrice: new Prisma.Decimal(dto.regularPrice),
          salePrice: dto.salePrice ? new Prisma.Decimal(dto.salePrice) : null,
          discountPercentage,
          stockQuantity: totalStock,
          material: dto.material || null,
          careInstructions: dto.careInstructions || null,
          isNewArrival: dto.isNewArrival ?? false,
          isFeatured: dto.isFeatured ?? false,
          isActive: dto.isActive ?? true,
          categoryId: dto.categoryId || null,
          collectionId: dto.collectionId || null,
          brandId: dto.brandId || null,
          seoTitle: dto.seoTitle || dto.name,
          seoDescription: dto.seoDescription || dto.shortDescription || null,
          images: {
            create: (dto.images || []).map((img, idx) => ({
              url: img.url,
              publicId: img.publicId,
              altText: img.altText || dto.name,
              displayOrder: img.displayOrder ?? idx,
              isPrimary: img.isPrimary ?? (idx === 0),
            })),
          },
          variants: {
            create: (dto.variants || []).map((v) => ({
              sku: v.sku,
              size: v.size,
              color: v.color,
              colorHex: v.colorHex || null,
              priceOverride: v.priceOverride ? new Prisma.Decimal(v.priceOverride) : null,
              stockQuantity: v.stockQuantity,
              isActive: v.isActive ?? true,
            })),
          },
        },
        include: {
          images: true,
          variants: true,
          category: true,
          collection: true,
        },
      });

      return product;
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    const discountPercentage = calculateDiscount(
      dto.regularPrice ?? Number(existing.regularPrice),
      dto.salePrice !== undefined ? dto.salePrice : (existing.salePrice ? Number(existing.salePrice) : null),
    );

    let totalStock = dto.stockQuantity ?? existing.stockQuantity;
    if (dto.variants && dto.variants.length > 0) {
      totalStock = dto.variants.reduce((acc, v) => acc + (v.stockQuantity || 0), 0);
    }

    return this.prisma.$transaction(async (tx) => {
      // If variants are supplied, replace or update
      if (dto.variants) {
        await tx.productVariant.deleteMany({ where: { productId: id } });
        await tx.productVariant.createMany({
          data: dto.variants.map((v) => ({
            productId: id,
            sku: v.sku,
            size: v.size,
            color: v.color,
            colorHex: v.colorHex || null,
            priceOverride: v.priceOverride ? new Prisma.Decimal(v.priceOverride) : null,
            stockQuantity: v.stockQuantity,
            isActive: v.isActive ?? true,
          })),
        });
      }

      // If images are supplied, update
      if (dto.images) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: dto.images.map((img, idx) => ({
            productId: id,
            url: img.url,
            publicId: img.publicId,
            altText: img.altText || dto.name || existing.name,
            displayOrder: img.displayOrder ?? idx,
            isPrimary: img.isPrimary ?? (idx === 0),
          })),
        });
      }

      const updated = await tx.product.update({
        where: { id },
        data: {
          name: dto.name,
          sku: dto.sku,
          description: dto.description,
          shortDescription: dto.shortDescription,
          regularPrice: dto.regularPrice ? new Prisma.Decimal(dto.regularPrice) : undefined,
          salePrice: dto.salePrice !== undefined ? (dto.salePrice ? new Prisma.Decimal(dto.salePrice) : null) : undefined,
          discountPercentage,
          stockQuantity: totalStock,
          material: dto.material,
          careInstructions: dto.careInstructions,
          isNewArrival: dto.isNewArrival,
          isFeatured: dto.isFeatured,
          isActive: dto.isActive,
          categoryId: dto.categoryId,
          collectionId: dto.collectionId,
          brandId: dto.brandId,
          seoTitle: dto.seoTitle,
          seoDescription: dto.seoDescription,
        },
        include: {
          images: true,
          variants: true,
          category: true,
          collection: true,
        },
      });

      return updated;
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { success: true, message: 'Product deleted successfully' };
  }

  async bulkUpdateStatus(ids: string[], isActive: boolean) {
    await this.prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { isActive },
    });

    return { success: true, message: `Updated status for ${ids.length} products` };
  }
}

