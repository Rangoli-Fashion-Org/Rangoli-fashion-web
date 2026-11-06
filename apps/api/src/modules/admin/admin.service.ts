import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserRole, OrderStatus, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalCustomers,
      lowStockProducts,
      recentOrders,
      paidOrders,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      this.prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
      this.prisma.product.count({ where: { stockQuantity: { lte: 5 } } }),
      this.prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
      this.prisma.order.findMany({
        where: { paymentStatus: PaymentStatus.PAID },
        select: { totalAmount: true, createdAt: true },
      }),
    ]);

    const totalSales = paidOrders.reduce((acc, o) => acc + Number(o.totalAmount), 0);

    return {
      totalSales,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalCustomers,
      totalProducts,
      lowStockCount: lowStockProducts,
      recentOrders,
    };
  }

  async getAdminUsers() {
    return this.prisma.user.findMany({
      where: {
        role: { in: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER] },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAdminUser(dto: { email: string; password: string; fullName: string; role: UserRole }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) throw new ConflictException('Email already in use');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    return this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        fullName: dto.fullName,
        role: dto.role || UserRole.ADMIN,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async updateAdminStatus(id: string, isActive: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Admin user not found');

    return this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, email: true, isActive: true },
    });
  }

  async getCustomers() {
    return this.prisma.user.findMany({
      where: { role: UserRole.CUSTOMER },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        isActive: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
