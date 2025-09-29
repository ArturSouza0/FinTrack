import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(TransactionType, { message: 'Type must be income or expense' })
  type: TransactionType;

  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid User ID format' })
  userId: string;
}

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsString()
  id: string;
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(TransactionType, { message: 'Type must be income or expense' })
  type?: TransactionType;
}

export class FindCategoryByIdDto {
  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid Category ID format' })
  id: string;
}

export class FindCategoriesByUserIdDto {
  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid User ID format' })
  userId: string;
}

export class DeleteCategoryDto {
  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid Category ID format' })
  id: string;
}
