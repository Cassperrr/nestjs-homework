import { Global, Module } from '@nestjs/common';

import { GrpcProcessModule } from './grpc/grpc-process.module';
import { OutboxWorkerModule } from './outbox/outbox-worker.module';
import { WebhookProcessModule } from './webhook/webhook-process.module';

@Global()
@Module({
	imports: [GrpcProcessModule, WebhookProcessModule, OutboxWorkerModule],
	exports: [GrpcProcessModule, WebhookProcessModule, OutboxWorkerModule]
})
export class ProcessesModule {}
