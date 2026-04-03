import { Module } from '@nestjs/common';

import { ConfigModule } from './config';
import { InfraModule } from './infra';
import { IntegrateModule } from './integrate';
import { TransactionGrpcService, YookassaWebhookService } from './providers';
import { TransactionConsumerModule } from './providers/consumer';
import { OutboxWorker } from './providers/outbox';
import { RepositoriesModule } from './repositories';
import { TransactionGrpcController } from './transaction-grpc.controller';
import { TransactionWebhookController } from './transaction-webhook.controller';

@Module({
	imports: [
		ConfigModule,
		InfraModule,
		RepositoriesModule,
		IntegrateModule,
		TransactionConsumerModule
	],
	controllers: [TransactionGrpcController, TransactionWebhookController],
	providers: [TransactionGrpcService, YookassaWebhookService, OutboxWorker]
})
export class TransactionModule {}
