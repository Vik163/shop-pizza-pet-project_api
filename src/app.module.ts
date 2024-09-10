import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { APP_GUARD } from '@nestjs/core';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ActionsModule } from './actions/actions.module';
import { OrderModule } from './order/order.module';
import { config } from './config/configuration';

@Module({
  imports: [
    // вместо localhost 127.0.0.1
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [config],
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT,
      database: process.env.DB_BASE,
      synchronize: true,
      autoLoadEntities: true,
      entities: [__dirname + './**/*.entity.ts'],
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../public/images'),
    }),
    ProductsModule,
    UserModule,
    AuthModule,
    ActionsModule,
    OrderModule,
  ],
})
export class AppModule {}
