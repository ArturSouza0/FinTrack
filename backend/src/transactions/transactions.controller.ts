import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import {
  CreateTransactionDto,
  DeleteTransactionDto,
  FindTransactionByIdDto,
  FindTransactionsByCategoryIdDto,
  FindTransactionsByUserIdDto,
  UpdateTransactionDto,
} from './Transactions';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('create')
  create(@Body() body: CreateTransactionDto) {
    return this.transactionsService.createTransaction(body);
  }

  @Get('findByUserId')
  getTransactionsByUserId(@Body() body: FindTransactionsByUserIdDto) {
    return this.transactionsService.getTransactionsByUserId(body);
  }

  @Get('findByCategoryId')
  getTransactionsByCategoryId(@Body() body: FindTransactionsByCategoryIdDto) {
    return this.transactionsService.getTransactionsByCategoryId(body);
  }

  @Get('findById')
  getTransactionById(@Body() body: FindTransactionByIdDto) {
    return this.transactionsService.getTransactionById(body);
  }

  @Put('update')
  updateTransaction(@Body() body: UpdateTransactionDto) {
    return this.transactionsService.updateTransaction(body);
  }

  @Delete('delete')
  deleteTransaction(@Body() body: DeleteTransactionDto) {
    return this.transactionsService.deleteTransaction(body);
  }
}
