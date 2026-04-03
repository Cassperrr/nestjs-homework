import {
	Inject,
	Injectable,
	Logger,
	type OnModuleDestroy,
	type OnModuleInit
} from '@nestjs/common';
import { Kafka, type LogEntry, type Producer, RecordMetadata } from 'kafkajs';

import { KafkaTopic } from '../config';
import { KAFKA_PRODUCER_OPTIONS } from '../constants';
import type { KafkaMessage, KafkaProducerModuleOptions } from '../interfaces';
import { kafkaLog } from '../utils';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(KafkaProducerService.name);
	private producer: Producer;

	public constructor(
		@Inject(KAFKA_PRODUCER_OPTIONS)
		private readonly options: KafkaProducerModuleOptions
	) {
		const kafka = new Kafka({
			...options.kafkaConfig,
			logCreator: () => (entry: LogEntry) => {
				kafkaLog(this.logger, entry);
			}
		});
		this.producer = kafka.producer(options.producerConfig);
	}

	public async onModuleInit(): Promise<void> {
		const start = Date.now();
		this.logger.log('Initializing Kafka producer...');
		try {
			await this.producer.connect();
			const ms = Date.now() - start;
			this.logger.log(`Kafka producer connected (time=${ms}ms)`);
		} catch (e) {
			this.logger.error('Kafka producer connection error', {
				error: e instanceof Error ? e.message : String(e)
			});
			throw e;
		}
	}

	public async onModuleDestroy(): Promise<void> {
		this.logger.log('Disconnecting Kafka producer...');
		try {
			await this.producer.disconnect();
			this.logger.log('Kafka producer disconnected');
		} catch (e) {
			this.logger.error('Error disconnecting Kafka producer', {
				error: e instanceof Error ? e.message : String(e)
			});
		}
	}

	public async publish<T>(
		topic: KafkaTopic,
		message: KafkaMessage<T>
	): Promise<RecordMetadata[]> {
		this.logger.debug(`Publishing to topic "${topic}"`, {
			key: message.key
		});
		try {
			const result = await this.producer.send({
				topic,
				messages: [
					{
						key: message.key,
						value: JSON.stringify(message.value)
					}
				]
			});
			this.logger.debug(`Published to topic "${topic}"`, {
				key: message.key,
				result
			});
			return result;
		} catch (e) {
			this.logger.error(`Failed to publish to topic "${topic}"`, {
				key: message.key,
				error: e instanceof Error ? e.message : String(e)
			});
			throw e;
		}
	}
}
