import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Pedido } from './pedidos/entities/pedido.entity';
import { Producto } from './productos/entities/producto.entity';
import { PedidoProducto } from './pedidos/entities/pedido-producto.entity';
import { PedidosModule } from './pedidos/pedidos.module';
import { ProductosModule } from './productos/productos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345',
      database: 'postgres',
      autoLoadEntities: true,
      entities: [Pedido, Producto, PedidoProducto],
      synchronize: true,
      logging: true,
    }),
    PedidosModule,
    ProductosModule,
  ],
})
export class AppModule {}


