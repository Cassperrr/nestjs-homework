import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientKafka } from '@nestjs/microservices';
import { CronExpression } from '@nestjs/schedule';
import type { TxServiceEnv } from '@transaction-service/src/config';
import { TransactionRepository } from '@transaction-service/src/core';
import { InjectKafkaProducer } from 'libsV2/kafka';
import { AbstractOutboxWorkerService } from 'libsV2/outbox';
import { OutboxEvent } from 'libsV2/outbox/abstracts/interfaces';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OutboxWorkerService extends AbstractOutboxWorkerService {
	public constructor(
		@InjectKafkaProducer() private readonly kafkaProducer: ClientKafka,
		private readonly txRepo: TransactionRepository,
		private readonly config: ConfigService<TxServiceEnv, true>
	) {
		super(CronExpression.EVERY_5_SECONDS);
	}

	protected findEvents(): Promise<OutboxEvent[]> {
		return this.txRepo.findUnprocessedEvents(
			this.config.get('LIMIT', { infer: true })
		);
	}

	protected async publishEvent(event: OutboxEvent): Promise<void> {
		await firstValueFrom(
			this.kafkaProducer.emit(event.topic, {
				key: event.id,
				value: event.payload
			})
		);
	}

	protected async markEventsAsProcessed(ids: string[]): Promise<void> {
		await this.txRepo.markEventsAsProcessed(ids);
	}
}
