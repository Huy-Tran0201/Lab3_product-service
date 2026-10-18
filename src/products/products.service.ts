import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto } from './dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private readonly repo: Repository<Product>) {}

  // Kiểm tra dữ liệu đầu vào
  private validate(dto: ProductDto, requireName: boolean) {
    if (!dto || typeof dto !== 'object') throw new BadRequestException('Thiếu dữ liệu gửi lên');
    if (requireName && (typeof dto.name !== 'string' || !dto.name.trim())) {
      throw new BadRequestException('name là bắt buộc');
    }
    if (dto.name !== undefined && (typeof dto.name !== 'string' || !dto.name.trim())) {
      throw new BadRequestException('name không được rỗng');
    }
    if (dto.price !== undefined && (isNaN(Number(dto.price)) || Number(dto.price) < 0)) {
      throw new BadRequestException('price phải là số >= 0');
    }
    if (dto.quantity !== undefined && (!Number.isInteger(Number(dto.quantity)) || Number(dto.quantity) < 0)) {
      throw new BadRequestException('quantity phải là số nguyên >= 0');
    }
  }

  // GET /products
  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  // GET /products/:id
  async findOne(id: number) {
    const product = await this.repo.findOneBy({ id });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    return product;
  }

  // POST /products
  async create(dto: ProductDto) {
    this.validate(dto, true);
    const product = this.repo.create({
      name: dto.name.trim(),
      description: dto.description ?? null,
      price: dto.price !== undefined ? Number(dto.price) : 0,
      quantity: dto.quantity !== undefined ? Number(dto.quantity) : 0,
    });
    const saved = await this.repo.save(product);
    return this.findOne(saved.id);
  }

  // PUT /products/:id
  async update(id: number, dto: ProductDto) {
    this.validate(dto, false);
    const product = await this.findOne(id);
    if (dto.name !== undefined) product.name = dto.name.trim();
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.price !== undefined) product.price = Number(dto.price);
    if (dto.quantity !== undefined) product.quantity = Number(dto.quantity);
    await this.repo.save(product);
    return this.findOne(id);
  }

  // DELETE /products/:id
  async remove(id: number) {
    await this.findOne(id); // 404 nếu không tồn tại
    await this.repo.delete({ id });
    return { message: 'Xóa sản phẩm thành công' };
  }
}
