import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionStatus } from '@prisma/client';
import { ProducerService } from 'src/kafka/producer.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService, private readonly producerService: ProducerService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const data = await this.prisma.transaction.create({
      data: createTransactionDto,
    });

    try {
      await this.producerService.produce({
        topic: 'test', //process.env.TOPIC
        messages: [{ value: JSON.stringify(data) }],
      });
    } catch (e) {
      console.error('message not send');
    }

    return data;
  }

  async findOne(id: string) {
    return await this.prisma.transaction.findUnique({ where: { id } });
  }

  async update(id: string, transactionStatus: string) {
    // Update order with current transaction and set up validatedByAntiFraud true
    // I'm assuming that only the microservice consume this endpoint
    return await this.prisma.transaction.update({
      where: { id },
      data: {
        transactionStatus: transactionStatus as TransactionStatus,
        validatedByAntiFraud: true,
      },
    });
  }
}
