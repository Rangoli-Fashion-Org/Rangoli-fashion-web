import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, SettingGroup } from '@prisma/client';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('public')
  getPublicSettings() {
    return this.settingsService.getAllSettings();
  }

  @Get('social-links')
  getSocialLinks() {
    return this.settingsService.getSocialLinks();
  }

  @Get('contact-info')
  getContactInfo() {
    return this.settingsService.getContactInfo();
  }

  @Get('about-content')
  getAboutContent() {
    return this.settingsService.getAboutContent();
  }

  // Admin Endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  @Get('admin/all')
  getAllSettings() {
    return this.settingsService.getAllSettings();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Put('admin/key/:key')
  updateSetting(
    @Param('key') key: string,
    @Body('value') value: string,
    @Body('group') group?: SettingGroup,
  ) {
    return this.settingsService.updateSetting(key, value, group);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  @Get('admin/social-links')
  adminGetSocialLinks() {
    return this.settingsService.adminGetSocialLinks();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post('admin/social-links')
  upsertSocialLink(@Body() body: { platform: string; url: string; icon?: string; displayOrder?: number }) {
    return this.settingsService.upsertSocialLink(body.platform, body.url, body.icon, body.displayOrder);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete('admin/social-links/:id')
  deleteSocialLink(@Param('id') id: string) {
    return this.settingsService.deleteSocialLink(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Put('admin/contact-info')
  updateContactInfo(@Body() body: any) {
    return this.settingsService.updateContactInfo(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Put('admin/about-content')
  updateAboutContent(@Body() body: any) {
    return this.settingsService.updateAboutContent(body);
  }
}
