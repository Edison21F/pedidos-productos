import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { ProductsService } from '../productos/productos.service';
import { Product } from '../productos/entities/producto.entity';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    private readonly productsService: ProductsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreatePedidoDto): Promise<Pedido> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const products: Product[] = [];

      for (const prod of dto.products) {
        let product: Product;
        if (prod.productId) {
          product = await this.productsService.findOne(prod.productId);
        } else {
          product = await this.productsService.create({
            name: prod.name ?? 'Default Name',
            price: prod.price ?? 0,
          });
        }
        products.push(product);
      }

      const pedido = this.pedidoRepository.create({
        customerName: dto.customerName,
        products,
      });

      await queryRunner.manager.save(pedido);
      await queryRunner.commitTransaction();

      return pedido;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Pedido[]> {
    return this.pedidoRepository.find({ relations: ['products'] });
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({ where: { id }, relations: ['products'] });
    if (!pedido) throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    return pedido;
  }

  async update(id: number, dto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);
    Object.assign(pedido, dto);
    return this.pedidoRepository.save(pedido);
  }

  async remove(id: number): Promise<void> {
    const pedido = await this.findOne(id);
    await this.pedidoRepository.remove(pedido);
  }
}
