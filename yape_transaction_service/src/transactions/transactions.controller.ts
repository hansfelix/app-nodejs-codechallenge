import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionsService.create(createTransactionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch('approve/:id')
  approve(@Param('id') id: string) {
    return this.transactionsService.update(id, 'approved');
  }

  @Patch('reject/:id')
  reject(@Param('id') id: string) {
    return this.transactionsService.update(id, 'rejected');
  }
}
