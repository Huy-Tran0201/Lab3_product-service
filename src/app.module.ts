import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './auth/auth.middleware';
import { Product } from './products/product.entity';
import { ProductsController } from './products/products.controller';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Kết nối MySQL riêng của Product Service (product_db)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'mysql',
        host: cfg.get('DB_HOST') || 'localhost',
        port: Number(cfg.get('DB_PORT')) || 3306,
        username: cfg.get('DB_USER') || 'root',
        password: cfg.get('DB_PASSWORD') || '',
        database: cfg.get('DB_NAME') || 'product_db',
        entities: [Product],
        synchronize: false, // bảng được tạo bằng database/schema.sql
      }),
    }),
    ProductsModule,
  ],
  providers: [AuthMiddleware],
})
export class AppModule implements NestModule {
  // Mọi route của /products đều phải đi qua middleware xác thực (gọi Auth Service TH2)
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ProductsController);
  }
}
