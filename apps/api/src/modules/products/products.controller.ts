import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from './dto/product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Public Endpoints
  @Get()
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('new-arrivals')
  findNewArrivals(@Query('limit') limit?: string) {
    return this.productsService.findNewArrivals(limit ? parseInt(limit, 10) : 8);
  }

  @Get('slug/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.productsService.findOneBySlug(slug);
  }

  // Admin Endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  @Get('admin/list')
  adminFindAll(@Query() query: ProductQueryDto) {
    return this.productsService.adminFindAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  @Get('admin/:id')
  adminFindOne(@Param('id') id: string) {
    return this.productsService.adminFindOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Patch('admin/bulk-status')
  bulkUpdateStatus(
    @Body() body: { ids: string[]; isActive: boolean },
  ) {
    return this.productsService.bulkUpdateStatus(body.ids, body.isActive);
  }
}
