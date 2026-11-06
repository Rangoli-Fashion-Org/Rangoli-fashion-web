import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { CartModule } from './modules/cart/cart.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { BannersModule } from './modules/banners/banners.module';
import { HomepageModule } from './modules/homepage/homepage.module';
import { SettingsModule } from './modules/settings/settings.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AdminModule,
    ProductsModule,
    CategoriesModule,
    CollectionsModule,
    CartModule,
    WishlistModule,
    OrdersModule,
    PaymentsModule,
    InventoryModule,
    CouponsModule,
    ReviewsModule,
    BannersModule,
    HomepageModule,
    SettingsModule,
    NewsletterModule,
    UploadModule,
  ],
})
export class AppModule {}
