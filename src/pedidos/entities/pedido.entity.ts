import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { Product } from '../../productos/entities/producto.entity';

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  customerName: string;

  @ManyToMany(() => Product, { cascade: true })
  @JoinTable({
    name: 'pedido_product',
    joinColumn: { name: 'pedidoId' },
    inverseJoinColumn: { name: 'productId' },
  })
  products: Product[];
}
