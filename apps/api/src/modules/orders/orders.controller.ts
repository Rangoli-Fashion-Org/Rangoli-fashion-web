import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { JwtAuthGuard, OptionalJwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole, OrderStatus } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  createOrder(
    @CurrentUser('id') userId: string | undefined,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  findUserOrders(@CurrentUser('id') userId: string) {
    return this.ordersService.findUserOrders(userId);
  }

  @Get('track/:orderNumber')
  findOrderByNumber(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.findOrderByNumber(orderNumber);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  findOrderById(
    @Param('id') orderId: string,
    @CurrentUser('id') userId?: string,
  ) {
    return this.ordersService.findOrderById(orderId, userId);
  }

  // Admin Endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  @Get('admin/list')
  adminFindAll(
    @Query('status') status?: OrderStatus,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ordersService.adminFindAll({ status, search, page, limit });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  @Put('admin/:id/status')
  adminUpdateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.adminUpdateStatus(id, dto);
  }
}

