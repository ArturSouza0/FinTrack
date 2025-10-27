import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCategoryDto,
  DeleteCategoryDto,
  FindCategoriesByUserIdDto,
  FindCategoryByIdDto,
  UpdateCategoryDto,
} from './Categories';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.prismaService.category.findFirst({
      where: {
        name: createCategoryDto.name,
        userId: createCategoryDto.userId,
      },
    });

    if (existingCategory) {
      throw new Error(
        `Category with name "${createCategoryDto.name}" already exists for this user.`,
      );
    }

    const newCategory = await this.prismaService.category.create({
      data: createCategoryDto,
    });

    return {
      message: `Category ${newCategory.name} created successfully`,
      category: newCategory,
    };
  }

  async getCategoryById(query: FindCategoryByIdDto) {
    const { id } = query; // Agora desestrutura de query, não de body

    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error(`Category with ID "${id}" not found.`);
    }

    return category;
  }

  async getCategoriesByUserId(query: FindCategoriesByUserIdDto) {
    const { userId } = query; // Agora desestrutura de query, não de body

    const categories = await this.prismaService.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });

    return categories;
  }
  async updateCategory(body: UpdateCategoryDto) {
    const { id, name } = body;
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error(`Category with ID "${id}" not found.`);
    }

    if (name && name !== category.name) {
      const existingCategory = await this.prismaService.category.findFirst({
        where: { name, userId: category.userId },
      });
      if (existingCategory) {
        throw new Error(
          `Category with name "${name}" already exists for this user.`,
        );
      }
    }

    const updatedCategory = await this.prismaService.category.update({
      where: { id },
      data: body,
    });

    return {
      message: `Category ${updatedCategory.name} updated successfully`,
      category: updatedCategory,
    };
  }
  async deleteCategory(body: DeleteCategoryDto) {
    const category = await this.prismaService.category.findUnique({
      where: { id: body.id },
    });

    if (!category) {
      throw new Error(`Category with ID "${body.id}" not found.`);
    }

    await this.prismaService.category.delete({ where: { id: body.id } });

    return { message: `Category ${category.name} deleted successfully` };
  }
}
