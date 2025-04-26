import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { Pedido } from './entities/pedido.entity';
import { Producto } from '../productos/entities/producto.entity';
import { PedidoProducto } from './entities/pedido-producto.entity';
import { ProductosModule } from '../productos/productos.module';  

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, Producto, PedidoProducto]),
    ProductosModule,  
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
  exports: [PedidosService],
})
export class PedidosModule {}

