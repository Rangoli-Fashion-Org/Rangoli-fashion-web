import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { HomepageService, SectionUpdateDto } from './homepage.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('homepage')
export class HomepageController {
  constructor(private readonly homepageService: HomepageService) {}

  @Get('sections')
  getLayout() {
    return this.homepageService.getLayout();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  @Get('admin/sections')
  adminGetAll() {
    return this.homepageService.adminGetAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Put('admin/sections/:id')
  updateSection(
    @Param('id') id: string,
    @Body() dto: SectionUpdateDto,
  ) {
    return this.homepageService.updateSection(id, dto);
  }
}
