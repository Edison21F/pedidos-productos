import { IsArray, IsDateString, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductoCantidadDto {
  @IsInt()
  @Min(1)
  productoId: number;

  @IsInt()
  @Min(1)
  cantidad: number;
}

export class CreatePedidoDto {
  @IsDateString()
  fecha: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoCantidadDto)
  productos: ProductoCantidadDto[];
}


