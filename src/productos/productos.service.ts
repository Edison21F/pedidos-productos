import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto) {
    try {
      if (!createProductoDto.nombre || !createProductoDto.precio) {
        throw new BadRequestException('El nombre y el precio son obligatorios.');
      }

      const producto = this.productosRepository.create(createProductoDto);
      return await this.productosRepository.save(producto);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el producto.');
    }
  }

  async findAll() {
    try {
      return await this.productosRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los productos.');
    }
  }

  async findOne(id: number) {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('ID inválido.');
    }

    const producto = await this.productosRepository.findOne({ where: { id } });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
    }

    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    if (!updateProductoDto || Object.keys(updateProductoDto).length === 0) {
      throw new BadRequestException('Datos para actualizar son requeridos.');
    }

    const producto = await this.findOne(id);

    Object.assign(producto, updateProductoDto);

    try {
      return await this.productosRepository.save(producto);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el producto.');
    }
  }

  async remove(id: number) {
    const producto = await this.findOne(id);

    try {
      return await this.productosRepository.remove(producto);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el producto.');
    }
  }
}
