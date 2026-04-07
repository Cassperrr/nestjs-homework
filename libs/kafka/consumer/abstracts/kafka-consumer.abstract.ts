import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Admin, Consumer, EachMessagePayload, Kafka, LogEntry } from 'kafkajs';
import { KafkaTopic } from 'libs/kafka/config';
import { KAFKA_CONSUMER_OPTIONS } from 'libs/kafka/constants';
import type { KafkaConsumerModuleOptions } from 'libs/kafka/interfaces';
import { kafkaLog } from 'libs/kafka/utils';

export abstract class AbstractKafkaConsumerService
	implements OnModuleInit, OnModuleDestroy
{
	@Inject(KAFKA_CONSUMER_OPTIONS)
	private readonly options: KafkaConsumerModuleOptions;

	protected readonly logger = new Logger(this.constructor.name);
	private consumer: Consumer;
	private admin: Admin;

	// дочерний класс обрабатывает каждое сообщение
	protected abstract handleMessage(
		topic: KafkaTopic,
		message: EachMessagePayload
	): Promise<void>;

	// хелпер для парсинга — дочерний класс использует в handleMessage
	protected parseMessage<T>(payload: EachMessagePayload): T {
		const raw = payload.message.value?.toString();
		if (!raw) throw new Error('Empty message value');
		return JSON.parse(raw) as T;
	}

	public async onModuleInit(): Promise<void> {
		const kafka = new Kafka({
			...this.options.kafkaConfig,
			logCreator: () => (entry: LogEntry) => {
				kafkaLog(this.logger, entry);
			}
		});
		this.consumer = kafka.consumer(this.options.consumerConfig);
		this.admin = kafka.admin();

		const start = Date.now();
		this.logger.log('Initializing Kafka consumer...');

		try {
			await this.ensureTopicsExist();

			await this.consumer.connect();
			await this.consumer.subscribe({
				topics: this.options.topics,
				fromBeginning: false
			});

			this.logger.log(
				`Kafka consumer connected (time=${Date.now() - start}ms)`
			);

			await this.consumer.run({
				eachMessage: async payload => this.messageProcessing(payload)
			});
		} catch (e) {
			this.logger.error('Kafka consumer connection error', {
				error: e instanceof Error ? e.message : String(e)
			});
			throw e;
		}
	}

	public async onModuleDestroy(): Promise<void> {
		this.logger.log('Disconnecting Kafka consumer...');
		try {
			await this.consumer.disconnect();
			this.logger.log('Kafka consumer disconnected');
		} catch (e) {
			this.logger.error('Error disconnecting Kafka consumer', {
				error: e instanceof Error ? e.message : String(e)
			});
		}
	}

	private async ensureTopicsExist(): Promise<void> {
		await this.admin.connect();

		const existing = await this.admin.listTopics();
		const missing = this.options.topics.filter(t => !existing.includes(t));

		if (missing.length === 0) return;

		this.logger.log(`Creating missing topics: ${missing.join(', ')}`);

		await this.admin.createTopics({
			topics: missing.map(topic => ({
				topic,
				numPartitions: 1,
				replicationFactor: 1
			}))
		});

		await this.admin.disconnect();
	}

	private async messageProcessing(payload: EachMessagePayload) {
		const topic = payload.topic as KafkaTopic;

		this.logger.debug(`Received message from topic "${topic}"`, {
			offset: payload.message.offset,
			key: payload.message.key?.toString()
		});

		await this.handleMessage(topic, payload).catch(error => {
			this.logger.error(`Error handling message from topic "${topic}"`, {
				error: error instanceof Error ? error.message : String(error),
				offset: payload.message.offset
			});
			// не бросаем ошибку дальше - kafkajs не будет ретраить
			// в продакшене здесь будет DLQ
		});
	}
}
