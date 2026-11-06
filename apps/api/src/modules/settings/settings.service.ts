import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SettingGroup } from '@prisma/client';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  // Store Settings
  async getAllSettings() {
    const settings = await this.prisma.storeSetting.findMany();
    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return result;
  }

  async getSettingsByGroup(group: SettingGroup) {
    return this.prisma.storeSetting.findMany({
      where: { group },
    });
  }

  async updateSetting(key: string, value: string, group: SettingGroup = SettingGroup.GENERAL) {
    return this.prisma.storeSetting.upsert({
      where: { key },
      update: { value, group },
      create: { key, value, group },
    });
  }

  // Social Links
  async getSocialLinks() {
    return this.prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async adminGetSocialLinks() {
    return this.prisma.socialLink.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  async upsertSocialLink(platform: string, url: string, icon?: string, displayOrder = 0) {
    return this.prisma.socialLink.upsert({
      where: { platform },
      update: { url, icon, displayOrder, isActive: true },
      create: { platform, url, icon, displayOrder, isActive: true },
    });
  }

  async deleteSocialLink(id: string) {
    await this.prisma.socialLink.delete({ where: { id } });
    return { success: true, message: 'Social link removed' };
  }

  // Contact Information
  async getContactInfo() {
    let contact = await this.prisma.contactInformation.findFirst();
    if (!contact) {
      contact = await this.prisma.contactInformation.create({
        data: {
          storeName: 'Rangoli Fashions',
          email: 'support@rangolifashions.com',
          phone: '+91 98765 43210',
          whatsapp: '+91 98765 43210',
          address: '42, Silk Heritage Lane, Fashion District',
          city: 'Jaipur',
          state: 'Rajasthan',
          country: 'India',
          postalCode: '302001',
          businessHours: 'Mon - Sat: 10:00 AM - 8:00 PM IST',
        },
      });
    }
    return contact;
  }

  async updateContactInfo(data: any) {
    const contact = await this.getContactInfo();
    return this.prisma.contactInformation.update({
      where: { id: contact.id },
      data,
    });
  }

  // About Content
  async getAboutContent() {
    return this.prisma.aboutContent.findFirst({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async updateAboutContent(data: any) {
    const existing = await this.prisma.aboutContent.findFirst();
    if (existing) {
      return this.prisma.aboutContent.update({
        where: { id: existing.id },
        data,
      });
    }
    return this.prisma.aboutContent.create({
      data: {
        heading: data.heading || 'Crafting Timeless Indian Elegance',
        brandStory: data.brandStory || 'Rangoli Fashions was born out of a deep reverence for India’s rich textile heritage.',
        mission: data.mission,
        vision: data.vision,
        imageUrl: data.imageUrl,
      },
    });
  }
}
