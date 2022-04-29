import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/Create-Product.dto';
import { ProductPaginationDto } from './dto/Product-Pagination.Dto';
import { UpdateProductDto } from './dto/Update-Product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const found = await this.productModel.findOne({
        title: createProductDto.title,
      });
      if (found)
        throw new ConflictException(
          `this product : ${createProductDto.title} is exist `,
        );

      const product = await new this.productModel(createProductDto);
      return await product.save();
    } catch (e) {
      throw new ConflictException(
        `this product : ${createProductDto.title} is exist `,
      );
    }
  }

  async ProductPagination(
    productPaginationDto: ProductPaginationDto,
  ): Promise<Product[]> {
    const { skip, limit, title, price, category } = productPaginationDto;

    const query = {
      title: title,
      price: price,
      category: category,
    };

    if (!title) delete query.title;
    if (!price) delete query.price;
    if (!category) delete query.category;

    const products = await this.productModel
      .find(query)
      .limit(limit)
      .skip(skip);
    return products;
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product)
      throw new BadRequestException(`id for this product not exist`);
    return product;
  }

  async updateProduct(
    updateProductDto: UpdateProductDto,
    id: string,
  ): Promise<Product> {
    const { title, description, stock, images, price, category } =
      updateProductDto;

    const productUpdate = {
      title: title,
      description: description,
      stock: stock,
      images: images,
      price: price,
      category: category,
    };

    if (!title) delete productUpdate.title;
    if (!description) delete productUpdate.description;
    if (!stock) delete productUpdate.stock;
    if (!images) delete productUpdate.images;
    if (!price) delete productUpdate.price;
    if (!category) delete productUpdate.category;

    const product = await this.productModel
      .findByIdAndUpdate(id, productUpdate)
      .catch((e) => {
        throw new BadRequestException(`product not exist`);
      });
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productModel.findByIdAndDelete(id);
  }
}
