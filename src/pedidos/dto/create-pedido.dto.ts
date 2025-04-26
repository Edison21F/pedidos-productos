import { IsArray, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePedidoDto {
  @IsString()
  customer_name: string;

  @IsString()
  customer_email: string;

  @IsNumber()
  total_amount: number;

  @IsString()
  status: string;

  @IsArray()
  @IsOptional()
  products: { product_id: number; quantity: number }[]; // Asegúrate que esto sea un array
}
