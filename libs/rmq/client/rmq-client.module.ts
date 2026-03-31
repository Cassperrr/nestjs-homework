import { type DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RMQ_CLIENT_PREFIX } from './constants';
import { RmqClientFactory } from './factories';
import { RMQ_CLIENTS } from './rmq-client.registry';

@Module({})
export class RmqClientModule {
	public static register(
		clients: Array<keyof typeof RMQ_CLIENTS>
	): DynamicModule {
		return {
			module: RmqClientModule,
			providers: [
				RmqClientFactory,
				...clients.map(token => {
					const cfg = RMQ_CLIENTS[token];
					return {
						provide: `${RMQ_CLIENT_PREFIX}_${token}`,
						useFactory: (
							factory: RmqClientFactory,
							config: ConfigService
						) => {
							const url = config.getOrThrow(cfg.env.url);
							const queue = config.getOrThrow(cfg.env.queue);

							const client = factory.createClient({
								urls: [url], // для кластеризации
								queue,
								queueOptions: { durable: true },
								// noAck: false,
								persistent: true
							});

							factory.register(token, client);

							return client;
						},
						inject: [RmqClientFactory, ConfigService]
					};
				})
			],
			exports: [
				RmqClientFactory,
				...clients.map(token => `${RMQ_CLIENT_PREFIX}_${token}`)
			]
		};
	}
}
