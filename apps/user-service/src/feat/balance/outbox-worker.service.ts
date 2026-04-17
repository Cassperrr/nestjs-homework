import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientKafka } from '@nestjs/microservices';
import { CronExpression } from '@nestjs/schedule';
import type { UserServiceEnv } from '@user-service/src/config';
import { BalanceRepository } from '@user-service/src/core';
import { InjectKafkaProducer } from 'libs/kafka';
import { AbstractOutboxWorkerService } from 'libs/outbox';
import { OutboxEvent } from 'libs/outbox';
import { firstValueFrom } from 'rxjs';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class OutboxWorkerService extends AbstractOutboxWorkerService {
	public constructor(
		@InjectKafkaProducer() private readonly kafkaProducer: ClientKafka,
		private readonly balanceRepo: BalanceRepository,
		private readonly config: ConfigService<UserServiceEnv, true>
	) {
		super(CronExpression.EVERY_5_SECONDS);
	}

	protected findEvents(): Promise<OutboxEvent[]> {
		return this.balanceRepo.findUnprocessedEvents(
			this.config.get('LIMIT', { infer: true })
		);
	}

	protected async publishEvent(event: OutboxEvent): Promise<void> {
		await firstValueFrom(
			this.kafkaProducer.emit(event.topic, {
				key: event.id,
				value: event.payload,
				headers: {
					idempotencyKey: uuidv7()
				}
			})
		);
	}

	protected async markEventsAsProcessed(ids: string[]): Promise<void> {
		await this.balanceRepo.markEventsAsProcessed(ids);
	}
}
