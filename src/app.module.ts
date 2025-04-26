import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './productos/productos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './productos/entities/producto.entity';
import { Pedido } from './pedidos/entities/pedido.entity';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: (process.env.DB_PASS || '').replace(/'/g, ''), // elimina las comillas si pusiste comillas en .env
      database: process.env.DB_NAME,
      entities: [Product, Pedido],
      synchronize: true, // ¡cuidado en producción! (borra y crea tablas autom.)
    }),
    ProductsModule,
    PedidosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
