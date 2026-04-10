import {
	Injectable,
	Logger,
	type OnModuleDestroy,
	type OnModuleInit
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientKafka } from '@nestjs/microservices';
import type { OutboxEvent } from '@transaction-service/prisma/generated/client';
import type { TxServiceEnv } from '@transaction-service/src/config';
import { OutboxRepository } from '@transaction-service/src/repositories';
import { InjectKafkaProducer } from 'libsV2/kafka';

@Injectable()
export class OutboxWorker implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(OutboxWorker.name);
	private intervalRef!: NodeJS.Timeout;
	private isProcessing = false;

	private readonly BATCH_SIZE: number;
	private readonly POLL_INTERVAL_MS: number;

	public constructor(
		@InjectKafkaProducer()
		private readonly kafkaProducer: ClientKafka,
		private readonly outboxRepo: OutboxRepository,
		private readonly config: ConfigService<TxServiceEnv, true>
	) {
		this.BATCH_SIZE = this.config.get('BATCH_SIZE', { infer: true });
		this.POLL_INTERVAL_MS = this.config.get('POLL_INTERVAL_MS', {
			infer: true
		});
	}

	public onModuleInit() {
		// Запускаем polling
		this.intervalRef = setInterval(
			() => void this.processOutbox(),
			this.POLL_INTERVAL_MS
		);

		// Первый запуск сразу
		void this.processOutbox();
	}

	public onModuleDestroy() {
		clearInterval(this.intervalRef);
	}

	private async processOutbox() {
		if (this.isProcessing) return;
		this.isProcessing = true;

		try {
			const events = await this.outboxRepo.findUnprocessedEvents(
				this.BATCH_SIZE
			);

			if (events.length === 0) return;

			this.logger.log(`Processing ${events.length} outbox events`);

			for (const event of events) {
				await this.processEvent(event);
			}
		} catch (err) {
			this.logger.error('Outbox polling error', err);
		} finally {
			this.isProcessing = false;
		}
	}

	private async processEvent(event: OutboxEvent): Promise<void> {
		try {
			this.kafkaProducer.emit(event.topic, {
				key: event.id,
				value: event.payload
			});

			await this.outboxRepo.switchEventToProcessed(event.id);

			this.logger.log(
				`Event ${event.id} published to topic [${event.topic}]`
			);
		} catch (error) {
			// если ошибка бд или кафки событие никак не отмечаем оно должно остаться прежним даже с дублем в кафке (идемпотность на уровне user-service), оно обработается в следующий раз
			this.logger.warn(`Event ${event.id} failed`, error);
		}
	}
}
