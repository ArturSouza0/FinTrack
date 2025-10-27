import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
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
  getCategoriesByUserId(@Query() query: FindCategoriesByUserIdDto) {
    return this.categoriesService.getCategoriesByUserId(query);
  }
  @Get('findById')
  getCategoryById(@Query() query: FindCategoryByIdDto) {
    return this.categoriesService.getCategoryById(query);
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
