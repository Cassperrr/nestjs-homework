import { type DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	ClientProxyFactory,
	type ClientRMQ,
	ClientsModule,
	Transport
} from '@nestjs/microservices';
import { RMQ_QUEUES } from 'registries';

import { createQueueToken } from '../utils';

/**
 * Глобально регистрирует очереди для Rmq Producer. Зависит от реестра очередей
 */
@Module({})
export class RmqQueueFactoryModule {
	public static registerAsync(
		queues: Array<keyof typeof RMQ_QUEUES>
	): DynamicModule {
		const clientsModule = ClientsModule.registerAsync(
			queues.map(key => ({
				name: createQueueToken(key),
				inject: [ConfigService],
				useFactory: (config: ConfigService) => {
					const queue = RMQ_QUEUES[key];
					const url = config.getOrThrow(queue.env.url);
					const logger = new Logger(RmqQueueFactoryModule.name);

					logger.warn(
						`RMQ Producer очередь "${queue.name}" зарегистрирована`
					);

					return {
						transport: Transport.RMQ,
						options: {
							urls: [url],
							queue: queue.name,
							queueOptions: { durable: true },
							persistent: true
						}
					};
				}
			}))
		);

		return {
			global: true,
			module: RmqQueueFactoryModule,
			imports: [clientsModule],
			exports: [clientsModule]
		};
	}
}
