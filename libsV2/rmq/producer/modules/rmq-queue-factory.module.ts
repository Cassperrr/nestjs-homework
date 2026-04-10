import { type DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	ClientProxyFactory,
	type ClientRMQ,
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
		return {
			global: true,
			module: RmqQueueFactoryModule,
			providers: queues.map(key => ({
				provide: createQueueToken(key),
				inject: [ConfigService],
				useFactory: (config: ConfigService) => {
					const queue = RMQ_QUEUES[key];

					const url = config.getOrThrow(queue.env.url);
					const name = queue.name;

					const logger = new Logger(RmqQueueFactoryModule.name);
					logger.warn(
						`RMQ Producer очередь "${name}" зарегистрирована`
					);

					return ClientProxyFactory.create({
						transport: Transport.RMQ,
						options: {
							urls: [url], // для кластеризации
							queue: name,
							queueOptions: { durable: true },
							persistent: true
						}
					}) as ClientRMQ;
				}
			})),
			exports: queues.map(key => createQueueToken(key))
		};
	}
}
