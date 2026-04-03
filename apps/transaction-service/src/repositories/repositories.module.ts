import { Global, Module } from '@nestjs/common';

import { OutboxRepository } from './outbox.repository';
import { TransactionRepository } from './transaction.repository';

@Global()
@Module({
	providers: [TransactionRepository, OutboxRepository],
	exports: [TransactionRepository, OutboxRepository]
})
export class RepositoriesModule {}
