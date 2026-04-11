import { type DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	type ClientKafka,
	ClientProxyFactory,
	ClientsModule,
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
	public static registerAsync(
		token: keyof typeof KAFKA_PRODUCERS
	): DynamicModule {
		const producer = KAFKA_PRODUCERS[token];
		const clientsModule = ClientsModule.registerAsync([
			{
				name: KAFKA_PRODUCER,
				inject: [ConfigService],
				useFactory: (config: ConfigService) => {
					const broker = config.getOrThrow(producer.env.broker);
					const logger = new Logger(KafkaProducerFactoryModule.name);
					logger.warn(`Kafka Producer "${token}" зарегистрирован`);
					return {
						transport: Transport.KAFKA,
						options: {
							client: {
								clientId: producer.id,
								brokers: [broker]
							}
						}
					};
				}
			}
		]);

		return {
			global: true,
			module: KafkaProducerFactoryModule,
			imports: [clientsModule],
			exports: [clientsModule]
		};
	}
}
