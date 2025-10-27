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

  // 🔁 Alterar para Query Parameters
  @Get('findByUserId')
  getTransactionsByUserId(@Query() query: FindTransactionsByUserIdDto) {
    return this.transactionsService.getTransactionsByUserId(query);
  }

  // 🔁 Alterar para Query Parameters
  @Get('findByCategoryId')
  getTransactionsByCategoryId(@Query() query: FindTransactionsByCategoryIdDto) {
    return this.transactionsService.getTransactionsByCategoryId(query);
  }

  // 🔁 Alterar para Query Parameters
  @Get('findById')
  getTransactionById(@Query() query: FindTransactionByIdDto) {
    return this.transactionsService.getTransactionById(query);
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
