import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  @Get('dashboard/stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Get('users')
  getAdminUsers() {
    return this.adminService.getAdminUsers();
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Post('users')
  createAdminUser(@Body() body: any) {
    return this.adminService.createAdminUser(body);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Put('users/:id/status')
  updateAdminStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.adminService.updateAdminStatus(id, isActive);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  @Get('customers')
  getCustomers() {
    return this.adminService.getCustomers();
  }
}

