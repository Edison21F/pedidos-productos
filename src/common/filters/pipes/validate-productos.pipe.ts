import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ProductosService } from '../../../productos/productos.service';


@Injectable()
export class ValidateProductosPipe implements PipeTransform {
  constructor(private readonly productosService: ProductosService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const productos = value.productos;

    for (const item of productos) {
      const producto = await this.productosService.findOne(item.productoId);
      if (!producto) {
        throw new BadRequestException(`Producto con ID ${item.productoId} no existe`);
      }
    }

    return value;
  }
}


