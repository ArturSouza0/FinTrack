import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import {
  CreateCategoryDto,
  DeleteCategoryDto,
  FindCategoriesByUserIdDto,
  FindCategoryByIdDto,
  UpdateCategoryDto,
} from './Categories';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create')
  create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.createCategory(body);
  }
  @Get('findByUserId')
  getCategoriesByUserId(@Body() body: FindCategoriesByUserIdDto) {
    return this.categoriesService.getCategoriesByUserId(body);
  }
  @Get('findById')
  getCategoryById(@Body() body: FindCategoryByIdDto) {
    return this.categoriesService.getCategoryById(body);
  }
  @Put('update')
  updateCategory(@Body() body: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(body);
  }
  @Delete('delete')
  deleteCategory(@Body() body: DeleteCategoryDto) {
    return this.categoriesService.deleteCategory(body);
  }
}
