import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
	Kafka,
	KafkaConfig,
	LogEntry,
	logLevel,
	Producer,
	ProducerConfig,
	RecordMetadata
} from 'kafkajs';

import { KafkaTopic } from './kafka.topics';

export interface KafkaMessage<T = unknown> {
	key?: string;
	value: T;
}

export abstract class AbstractKafkaProducerService
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(this.constructor.name);
	private producer: Producer;

	public constructor(
		kafkaConfig: KafkaConfig,
		producerConfig?: ProducerConfig
	) {
		const kafka = new Kafka({
			...kafkaConfig,
			logCreator: () => (entry: LogEntry) => {
				this.kafkaLog(entry);
			}
		});
		this.producer = kafka.producer(producerConfig);
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
			this.logger.debug(`Published to topic "${topic}"`, { result });
			return result;
		} catch (e) {
			this.logger.error(`Failed to publish to topic "${topic}"`, {
				error: e instanceof Error ? e.message : String(e)
			});
			throw e;
		}
	}

	private kafkaLog(entry: LogEntry): void {
		const { level, log } = entry;
		const { message, ...rest } = log;
		const context = rest.broker ? `KafkaJS [${rest.broker}]` : 'KafkaJS';
		const meta = Object.keys(rest).length ? rest : undefined;

		switch (level) {
			case logLevel.ERROR:
				this.logger.error(message, meta, context);
				break;
			case logLevel.WARN:
				this.logger.warn(message, context);
				break;
			case logLevel.INFO:
				this.logger.log(message, context);
				break;
			case logLevel.DEBUG:
				this.logger.debug(message, context);
				break;
		}
	}
}
