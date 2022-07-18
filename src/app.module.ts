import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Product } from './modules/product/product.entity';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'nest',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    ProductModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
