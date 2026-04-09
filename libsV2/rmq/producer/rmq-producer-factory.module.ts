import { type DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	ClientProxyFactory,
	type ClientRMQ,
	Transport
} from '@nestjs/microservices';
import { RMQ_CLIENTS } from 'registries';

import { createClientToken } from './utils';

/**
 * Фабрика клиентов (producer) RMQ.
 * Зависит от реестра клиентов и регистрирует переданные пакеты.
 */
@Module({})
export class RmqProducerFactoryModule {
	public static registerAsync(
		clients: Array<keyof typeof RMQ_CLIENTS>
	): DynamicModule {
		return {
			module: RmqProducerFactoryModule,
			providers: [
				...clients.map(token => {
					const client = RMQ_CLIENTS[token];
					return {
						provide: createClientToken(token),
						useFactory: (config: ConfigService) => {
							const url = config.getOrThrow(client.env.url);
							const queue = config.getOrThrow(client.env.queue);

							return ClientProxyFactory.create({
								transport: Transport.RMQ,
								options: {
									urls: [url], // для кластеризации
									queue,
									queueOptions: { durable: true },
									// noAck: false,
									persistent: true
								}
							}) as ClientRMQ;
						},
						inject: [ConfigService]
					};
				})
			],
			exports: [...clients.map(token => createClientToken(token))]
		};
	}
}
