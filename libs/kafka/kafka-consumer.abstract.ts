import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
	Admin,
	Consumer,
	ConsumerConfig,
	EachMessagePayload,
	Kafka,
	KafkaConfig,
	LogEntry,
	logLevel
} from 'kafkajs';

import { KafkaTopic } from './kafka.topics';

export abstract class AbstractKafkaConsumerService
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(this.constructor.name);
	private consumer: Consumer;
	private admin: Admin;

	public constructor(
		kafkaConfig: KafkaConfig,
		consumerConfig: ConsumerConfig
	) {
		const kafka = new Kafka({
			...kafkaConfig,
			logCreator: () => (entry: LogEntry) => {
				this.kafkaLog(entry);
			}
		});
		this.consumer = kafka.consumer(consumerConfig);
		this.admin = kafka.admin();
	}

	// дочерний класс объявляет какие топики слушать
	protected abstract getTopics(): KafkaTopic[];

	// дочерний класс обрабатывает каждое сообщение
	protected abstract handleMessage(
		topic: KafkaTopic,
		message: EachMessagePayload
	): Promise<void>;

	public async onModuleInit(): Promise<void> {
		const start = Date.now();
		this.logger.log('Initializing Kafka consumer...');

		try {
			await this.admin.connect();
			await this.ensureTopicsExist();
			await this.admin.disconnect();

			await this.consumer.connect();
			await this.consumer.subscribe({
				topics: this.getTopics(),
				fromBeginning: false // читаем только новые сообщения
			});

			const ms = Date.now() - start;
			this.logger.log(`Kafka consumer connected (time=${ms}ms)`);

			await this.consumer.run({
				eachMessage: async payload => {
					const topic = payload.topic as KafkaTopic;

					this.logger.debug(
						`Received message from topic "${topic}"`,
						{
							offset: payload.message.offset,
							key: payload.message.key?.toString()
						}
					);

					try {
						await this.handleMessage(topic, payload);
					} catch (e) {
						this.logger.error(
							`Error handling message from topic "${topic}"`,
							{
								error:
									e instanceof Error ? e.message : String(e),
								offset: payload.message.offset
							}
						);
						// не бросаем ошибку дальше - kafkajs не будет ретраить
						// в продакшене здесь будет DLQ
					}
				}
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

	// хелпер для парсинга — дочерний класс использует в handleMessage
	protected parseMessage<T>(payload: EachMessagePayload): T {
		const raw = payload.message.value?.toString();
		if (!raw) throw new Error('Empty message value');
		return JSON.parse(raw) as T;
	}

	private async ensureTopicsExist(): Promise<void> {
		const topics = this.getTopics();
		const existing = await this.admin.listTopics();
		const missing = topics.filter(t => !existing.includes(t));

		if (missing.length === 0) return;

		this.logger.log(`Creating missing topics: ${missing.join(', ')}`);
		await this.admin.createTopics({
			topics: missing.map(topic => ({
				topic,
				numPartitions: 1,
				replicationFactor: 1
			}))
		});
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
