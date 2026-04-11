import { Global, Module } from '@nestjs/common';

import { GrpcProcessModule } from './grpc/grpc-process.module';
import { KafkaProcessModule } from './kafka/kafka-process.module';
import { OutboxWorkerModule } from './outbox/outbox-worker.module';
import { WebhookProcessModule } from './webhook/webhook-process.module';

@Global()
@Module({
	imports: [
		GrpcProcessModule,
		WebhookProcessModule,
		OutboxWorkerModule,
		KafkaProcessModule
	],
	exports: [
		GrpcProcessModule,
		WebhookProcessModule,
		OutboxWorkerModule,
		KafkaProcessModule
	]
})
export class ProcessesModule {}
