import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/Create-Product.dto';
import { Product } from './schemas/product.schema';
import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/Authorization/roles.guard';
import { Roles } from '../auth/Authorization/roles.decorator';
import { Role } from '../auth/Authorization/role.enum';
import { ProductPaginationDto } from './dto/Product-Pagination.Dto';
import { UpdateProductDto } from './dto/Update-Product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @GetUser() id: string,
  ): Promise<Product> {
    createProductDto.user = id;
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  ProductPagination(
    @Query() productPaginationDto: ProductPaginationDto,
  ): Promise<Product[]> {
    return this.productService.ProductPagination(productPaginationDto);
  }

  @Get(':id')
  getProduct(@Param('id') id: string): Promise<Product> {
    return this.productService.getProduct(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id') id: string,
  ): Promise<Product> {
    console.log(updateProductDto, id);
    return this.productService.updateProduct(updateProductDto, id);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productService.deleteProduct(id);
  }
}
