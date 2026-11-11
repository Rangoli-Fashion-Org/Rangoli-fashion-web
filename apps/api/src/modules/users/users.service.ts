import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateAddressDto, UpdateProfileDto } from './dto/address.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        addresses: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.fullName ? { fullName: dto.fullName } : {}),
        ...(dto.phoneNumber !== undefined ? { phoneNumber: dto.phoneNumber } : {}),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
      },
    });
  }

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAddress(userId: string, dto: CreateAddressDto) {
    if (dto.isDefaultShipping) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefaultShipping: false },
      });
    }

    if (dto.isDefaultBilling) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefaultBilling: false },
      });
    }

    return this.prisma.address.create({
      data: {
        userId,
        fullName: dto.fullName?.trim(),
        phoneNumber: dto.phoneNumber?.trim(),
        street: dto.street?.trim(),
        apartment: dto.apartment?.trim() || null,
        city: dto.city?.trim(),
        state: dto.state?.trim(),
        postalCode: dto.postalCode?.trim(),
        country: dto.country?.trim() || 'India',
        isDefaultShipping: dto.isDefaultShipping ?? false,
        isDefaultBilling: dto.isDefaultBilling ?? false,
      },
    });
  }

  async updateAddress(userId: string, addressId: string, dto: Partial<CreateAddressDto>) {
    const existing = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      throw new NotFoundException('Address not found');
    }

    if (dto.isDefaultShipping) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefaultShipping: false },
      });
    }

    if (dto.isDefaultBilling) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefaultBilling: false },
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: {
        ...(dto.fullName ? { fullName: dto.fullName.trim() } : {}),
        ...(dto.phoneNumber ? { phoneNumber: dto.phoneNumber.trim() } : {}),
        ...(dto.street ? { street: dto.street.trim() } : {}),
        ...(dto.apartment !== undefined ? { apartment: dto.apartment?.trim() || null } : {}),
        ...(dto.city ? { city: dto.city.trim() } : {}),
        ...(dto.state ? { state: dto.state.trim() } : {}),
        ...(dto.postalCode ? { postalCode: dto.postalCode.trim() } : {}),
        ...(dto.country ? { country: dto.country.trim() } : {}),
        ...(dto.isDefaultShipping !== undefined ? { isDefaultShipping: dto.isDefaultShipping } : {}),
        ...(dto.isDefaultBilling !== undefined ? { isDefaultBilling: dto.isDefaultBilling } : {}),
      },
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const existing = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      throw new NotFoundException('Address not found');
    }

    await this.prisma.address.delete({
      where: { id: addressId },
    });

    return { success: true, message: 'Address removed successfully' };
  }
}

