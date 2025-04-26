import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PedidoProducto } from './pedido-producto.entity';

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: Date;

  @OneToMany(() => PedidoProducto, pedidoProducto => pedidoProducto.pedido, { cascade: true })
  pedidoProductos: PedidoProducto[];
}


