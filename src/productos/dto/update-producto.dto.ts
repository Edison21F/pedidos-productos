
import { IsString, IsInt, Min } from 'class-validator';

export class UpdateProductoDto {
  @IsInt()
  @Min(1)
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  price: number;
}
