import { type DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	type ClientKafka,
	ClientProxyFactory,
	Transport
} from '@nestjs/microservices';
import { KAFKA_PRODUCERS } from 'registries';

import { KAFKA_PRODUCER } from '../constants';

/**
 * Регистрирует Kafka producer.
 * Зависит от реестра клиентов. Принимает одного клиента.
 */
@Module({})
export class KafkaProducerFactoryModule {
	public static regiserAsync(
		token: keyof typeof KAFKA_PRODUCERS
	): DynamicModule {
		return {
			global: true,
			module: KafkaProducerFactoryModule,
			providers: [
				{
					provide: KAFKA_PRODUCER,
					inject: [ConfigService],
					useFactory: (config: ConfigService) => {
						const producer = KAFKA_PRODUCERS[token];
						const broker = config.getOrThrow(producer.env.broker);

						const logger = new Logger(
							KafkaProducerFactoryModule.name
						);
						logger.warn(
							`Kafka Producer "${producer.id}" зарегистрирован`
						);

						return ClientProxyFactory.create({
							transport: Transport.KAFKA,
							options: {
								client: {
									clientId: producer.id,
									brokers: [broker]
								}
							}
						}) as ClientKafka;
					}
				}
			],
			exports: [KAFKA_PRODUCER]
		};
	}
}
