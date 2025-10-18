import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateTransactionDto,
  DeleteTransactionDto,
  FindTransactionByIdDto,
  FindTransactionsByCategoryIdDto,
  FindTransactionsByUserIdDto,
  UpdateTransactionDto,
} from './Transactions';

@Injectable()
export class TransactionsService {
  constructor(private prismaService: PrismaService) {}

  async createTransaction(dto: CreateTransactionDto) {
    // valida categoria e pertence ao usuário
    const category = await this.prismaService.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new Error(`Category with ID "${dto.categoryId}" not found.`);
    }
    if (category.userId !== dto.userId) {
      throw new Error(`Category does not belong to the provided user.`);
    }

    const newTransaction = await this.prismaService.transaction.create({
      data: {
        title: dto.title,
        amount: dto.amount,
        type: dto.type,
        date: new Date(dto.date),
        categoryId: dto.categoryId,
        userId: dto.userId,
        receiptUrl: dto.receiptUrl ?? null,
      },
    });

    return {
      message: `Transaction ${newTransaction.title} created successfully`,
      transaction: newTransaction,
    };
  }

  async getTransactionById(body: FindTransactionByIdDto) {
    const { id } = body;
    const transaction = await this.prismaService.transaction.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!transaction) {
      throw new Error(`Transaction with ID "${id}" not found.`);
    }

    return transaction;
  }

  async getTransactionsByUserId(body: FindTransactionsByUserIdDto) {
    const { userId } = body;
    const transactions = await this.prismaService.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      include: { category: true },
    });

    return transactions;
  }

  async getTransactionsByCategoryId(body: FindTransactionsByCategoryIdDto) {
    const { categoryId } = body;
    const transactions = await this.prismaService.transaction.findMany({
      where: { categoryId },
      orderBy: { date: 'desc' },
      include: { category: true },
    });

    return transactions;
  }

  async updateTransaction(body: UpdateTransactionDto) {
    const { id } = body;

    const transaction = await this.prismaService.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new Error(`Transaction with ID "${id}" not found.`);
    }

    if (body.categoryId) {
      const categoryExists = await this.prismaService.category.findUnique({
        where: { id: body.categoryId },
      });

      if (!categoryExists) {
        throw new Error(`Category with ID "${body.categoryId}" not found.`);
      }
    }

    const updatedTransaction = await this.prismaService.transaction.update({
      where: { id },
      data: {
        ...body,
        date: body.date ? new Date(body.date) : undefined,
      },
      include: { category: true },
    });

    return {
      message: `Transaction "${updatedTransaction.title}" updated successfully.`,
      transaction: updatedTransaction,
    };
  }

  async deleteTransaction(body: DeleteTransactionDto) {
    const { id } = body;
    const transaction = await this.prismaService.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new Error(`Transaction with ID "${id}" not found.`);
    }

    await this.prismaService.transaction.delete({ where: { id } });

    return { message: `Transaction ${transaction.title} deleted successfully` };
  }
}
