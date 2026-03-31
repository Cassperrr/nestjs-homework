import { type DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GRPC_CLIENTS } from './config';
import { GRPC_CLIENT_PREFIX } from './constants';
import { GrpcClientFactory } from './factories';

@Module({})
export class GrpcClientModule {
	public static register(
		clients: Array<keyof typeof GRPC_CLIENTS>
	): DynamicModule {
		return {
			module: GrpcClientModule,
			providers: [
				GrpcClientFactory,
				...clients.map(token => {
					const cfg = GRPC_CLIENTS[token];
					return {
						provide: `${GRPC_CLIENT_PREFIX}_${token}`,
						useFactory: (
							factory: GrpcClientFactory,
							config: ConfigService
						) => {
							const url = config.getOrThrow(cfg.env.url);
							const timeMs = config.getOrThrow(cfg.env.timeMs);
							const timeoutMs = config.getOrThrow(
								cfg.env.timeoutMs
							);
							const deadlineSec = config.getOrThrow(
								cfg.env.deadlineSec
							);

							const client = factory.createClient({
								package: cfg.package,
								protoPath: cfg.protoPath,
								url,
								channelOptions: {
									'grpc.keepalive_time_ms': timeMs,
									'grpc.keepalive_timeout_ms': timeoutMs,
									'grpc.connect_deadline_seconds': deadlineSec
								}
							});

							factory.register(token, client);

							return client;
						},
						inject: [GrpcClientFactory, ConfigService]
					};
				})
			],
			exports: [
				GrpcClientFactory,
				...clients.map(token => `${GRPC_CLIENT_PREFIX}_${token}`)
			]
		};
	}
}
