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
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/Authorization/roles.guard';
import { Roles } from '../auth/Authorization/roles.decorator';
import { Role } from '../auth/Authorization/role.enum';
import { CreateCategoryDto } from './Dto/create-Category.Dto';
import { Category } from './Schemas/category.schema';
import { PaginationCategoryDto } from './Dto/pagination-category.dto';
import { UpdateCategoryDto } from './Dto/Update-Category.Dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  createCategory(@Body() category: CreateCategoryDto): Promise<Category> {
    return this.categoryService.createCategory(category);
  }

  @Get()
  categoryPagination(
    @Query() pagination: PaginationCategoryDto,
  ): Promise<{ count: number; category: Category[] }> {
    return this.categoryService.categoryPagination(pagination);
  }

  @Get('all')
  allCategory(): Promise<Category[]> {
    return this.categoryService.allCategory();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  deleteCategory(@Param('id') id: string): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }

  @Put(':id')
  UpdateCategory(
    @Param('id') id: string,
    @Body() category: UpdateCategoryDto,
  ): Promise<void> {
    return this.categoryService.UpdateCategory(id, category);
  }
}
