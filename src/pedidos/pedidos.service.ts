import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoProducto } from './entities/pedido-producto.entity';
import { Producto } from '../productos/entities/producto.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidosRepository: Repository<Pedido>,

    @InjectRepository(Producto)
    private readonly productosRepository: Repository<Producto>,

    @InjectRepository(PedidoProducto)
    private readonly pedidoProductoRepository: Repository<PedidoProducto>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createPedidoDto: CreatePedidoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validación: ¿fecha es válida?
      if (!createPedidoDto.fecha || isNaN(new Date(createPedidoDto.fecha).getTime())) {
        throw new BadRequestException('Fecha inválida para el pedido.');
      }

      const pedido = this.pedidosRepository.create({ fecha: new Date(createPedidoDto.fecha) });
      await queryRunner.manager.save(pedido);

      if (!createPedidoDto.productos || createPedidoDto.productos.length === 0) {
        throw new BadRequestException('Debes agregar al menos un producto al pedido.');
      }

      for (const item of createPedidoDto.productos) {
        if (!item.productoId || !item.cantidad || item.cantidad <= 0) {
          throw new BadRequestException('Cada producto debe tener un productoId válido y una cantidad mayor a 0.');
        }

        const producto = await this.productosRepository.findOneBy({ id: item.productoId });
        if (!producto) {
          throw new NotFoundException(`Producto con ID ${item.productoId} no encontrado.`);
        }

        const pedidoProducto = this.pedidoProductoRepository.create({
          pedido,
          producto,
          cantidad: item.cantidad,
        });

        await queryRunner.manager.save(pedidoProducto);
      }

      await queryRunner.commitTransaction();
      return pedido;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (!(error instanceof BadRequestException) && !(error instanceof NotFoundException)) {
        throw new InternalServerErrorException('Error inesperado al crear el pedido.');
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.pedidosRepository.find({
      relations: ['pedidoProductos', 'pedidoProductos.producto'],
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido.');
    }

    const pedido = await this.pedidosRepository.findOne({
      where: { id },
      relations: ['pedidoProductos', 'pedidoProductos.producto'],
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado.`);
    }

    return pedido;
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto) {
    const pedido = await this.findOne(id);

    if (updatePedidoDto.fecha) {
      if (isNaN(new Date(updatePedidoDto.fecha).getTime())) {
        throw new BadRequestException('Fecha inválida.');
      }
      pedido.fecha = new Date(updatePedidoDto.fecha);
    }

    if (updatePedidoDto.productos) {
      await this.pedidoProductoRepository.delete({ pedido: { id: pedido.id } });

      if (updatePedidoDto.productos.length === 0) {
        throw new BadRequestException('Debes agregar al menos un producto al pedido.');
      }

      for (const item of updatePedidoDto.productos) {
        if (!item.productoId || !item.cantidad || item.cantidad <= 0) {
          throw new BadRequestException('Cada producto debe tener un productoId válido y una cantidad mayor a 0.');
        }

        const producto = await this.productosRepository.findOneBy({ id: item.productoId });
        if (!producto) {
          throw new NotFoundException(`Producto con ID ${item.productoId} no encontrado.`);
        }

        const pedidoProducto = this.pedidoProductoRepository.create({
          pedido,
          producto,
          cantidad: item.cantidad,
        });

        await this.pedidoProductoRepository.save(pedidoProducto);
      }
    }

    return this.pedidosRepository.save(pedido);
  }

  async remove(id: number) {
    const pedido = await this.findOne(id);
    await this.pedidosRepository.remove(pedido);
    return { message: `Pedido con ID ${id} eliminado exitosamente.` };
  }
}
