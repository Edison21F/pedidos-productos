import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PedidoProducto } from '../../pedidos/entities/pedido-producto.entity';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('decimal')
  precio: number;

  @OneToMany(() => PedidoProducto, pedidoProducto => pedidoProducto.producto)
  pedidoProductos: PedidoProducto[];
}


