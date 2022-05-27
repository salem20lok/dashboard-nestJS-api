import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './Schemas/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './Dto/create-Category.Dto';
import { PaginationCategoryDto } from './Dto/pagination-category.dto';
import { UpdateCategoryDto } from './Dto/Update-Category.Dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async createCategory(createCategory: CreateCategoryDto): Promise<Category> {
    const found = await this.categoryModel.findOne({
      name: createCategory.name,
    });

    if (found)
      throw new ConflictException(
        `this category : ${createCategory.name} is ealready exist `,
      );
    const category = new this.categoryModel(createCategory);
    return await category.save();
  }

  async categoryPagination(
    pagination: PaginationCategoryDto,
  ): Promise<{ count: number; category: Category[] }> {
    const { skip } = pagination;
    const category = await this.categoryModel.find({}).skip(skip).limit(6);
    const count = await this.categoryModel.find({}).count();
    return {
      count: count,
      category: category,
    };
  }

  async allCategory(): Promise<Category[]> {
    return await this.categoryModel.find({});
  }

  async deleteCategory(id: string): Promise<void> {
    await this.categoryModel.findByIdAndDelete(id);
  }

  async UpdateCategory(id: string, category: UpdateCategoryDto): Promise<void> {
    await this.categoryModel.findByIdAndUpdate(id, category);
  }
}
