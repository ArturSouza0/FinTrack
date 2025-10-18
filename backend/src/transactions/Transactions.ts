import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'Amount must be a number' })
  amount: number;

  @IsNotEmpty()
  @IsEnum(TransactionType, { message: 'Type must be income or expense' })
  type: TransactionType;

  @IsNotEmpty()
  @IsDateString({}, { message: 'Invalid date format' })
  date: string;

  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid Category ID format' })
  categoryId: string;

  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid User ID format' })
  userId: string;

  @IsOptional()
  @IsString()
  receiptUrl?: string;
}

export class UpdateTransactionDto {
  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid Transaction ID format' })
  id: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Amount must be a number' })
  amount?: number;

  @IsOptional()
  @IsEnum(TransactionType, { message: 'Type must be income or expense' })
  type?: TransactionType;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format' })
  date?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Invalid Category ID format' })
  categoryId?: string;

  @IsOptional()
  @IsString()
  receiptUrl?: string;
}

export class FindTransactionByIdDto {
  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid Transaction ID format' })
  id: string;
}

export class FindTransactionsByUserIdDto {
  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid User ID format' })
  userId: string;
}

export class FindTransactionsByCategoryIdDto {
  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid Category ID format' })
  categoryId: string;
}

export class DeleteTransactionDto {
  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid Transaction ID format' })
  id: string;
}
