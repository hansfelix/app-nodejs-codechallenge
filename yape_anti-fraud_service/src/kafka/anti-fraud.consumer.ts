import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import axios from 'axios';

@Injectable()
export class AntiFraudConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}
  async onModuleInit() {
    this.consumerService.consume(
      { topic: 'test' },
      {
        eachMessage: async ({ topic, partition, message }) => {
          // Get transaction object
          const transaction = JSON.parse(message.value.toString());

          // Che
          // Update event and
          if (transaction.value > 1000) {
            await axios.patch(
              `http://yape_transaction_service:3000/transactions/reject/${transaction.id}`,
            );
            console.log('transaction rejected');
          } else {
            await axios.patch(
              `http://yape_transaction_service:3000/transactions/approve/${transaction.id}`,
            );
            console.log('transaction approved');
          }
          //   const response = await
          console.log(message.value.toString());
        },
      },
    );
  }
}
