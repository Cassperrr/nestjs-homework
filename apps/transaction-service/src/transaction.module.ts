import { Module } from '@nestjs/common';

import { ConfigModule } from './config';
import { InfraModule } from './infra';
import { IntegrateModule } from './integrate';
import {
	OutboxRepository,
	TransactionGrpcService,
	TransactionRepository,
	YookassaWebhookService
} from './providers';
import { OutboxWorker } from './providers/outbox';
import { TransactionGrpcController } from './transaction-grpc.controller';
import { TransactionWebhookController } from './transaction-webhook.controller';

@Module({
	imports: [ConfigModule, InfraModule, IntegrateModule],
	controllers: [TransactionGrpcController, TransactionWebhookController],
	providers: [
		TransactionRepository,
		OutboxRepository,
		TransactionGrpcService,
		YookassaWebhookService,
		OutboxWorker
	]
})
export class TransactionModule {}
