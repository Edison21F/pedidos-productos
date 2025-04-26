import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity()
export class PedidoProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pedido, pedido => pedido.pedidoProductos)
  pedido: Pedido;

  @ManyToOne(() => Producto, producto => producto.pedidoProductos)
  producto: Producto;

  @Column('int')
  cantidad: number;
}

