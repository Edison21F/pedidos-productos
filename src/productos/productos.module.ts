import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './productos.service';
import { ProductsController } from './productos.controller';
import { Product } from './entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // Exportarlo para que PedidosService pueda usarlo
})
export class ProductsModule {}
