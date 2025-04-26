import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Pedido } from '../../pedidos/entities/pedido.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column('decimal')
  price: number;

  @ManyToMany(() => Pedido, pedido => pedido.products)
  pedidos: Pedido[];
}
