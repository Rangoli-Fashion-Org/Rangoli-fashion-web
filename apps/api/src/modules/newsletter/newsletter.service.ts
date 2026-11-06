import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { isValidEmail } from '@rangoli/validation';

@Injectable()
export class NewsletterService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribe(email: string) {
    if (!isValidEmail(email)) {
      throw new BadRequestException('Please provide a valid email address');
    }

    const normalized = email.toLowerCase().trim();
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email: normalized },
    });

    if (existing) {
      if (!existing.isActive) {
        await this.prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: { isActive: true },
        });
        return { success: true, message: 'Welcome back to Rangoli Fashions newsletter!' };
      }
      return { success: true, message: 'You are already subscribed to our newsletter.' };
    }

    await this.prisma.newsletterSubscriber.create({
      data: {
        email: normalized,
      },
    });

    return {
      success: true,
      message: 'Thank you for subscribing to Rangoli Fashions!',
    };
  }

  async adminFindAll(search?: string) {
    const where = search ? { email: { contains: search, mode: 'insensitive' as const } } : {};
    return this.prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { subscribedAt: 'desc' },
    });
  }

  async adminUnsubscribe(id: string) {
    await this.prisma.newsletterSubscriber.update({
      where: { id },
      data: { isActive: false },
    });
    return { success: true, message: 'Subscriber deactivated' };
  }
}
