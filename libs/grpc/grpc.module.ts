import { type DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GrpcClientFactory } from './grpc-client.factory';
import { GRPC_CLIENT_PREFIX } from './grpc.constants';
import { GRPC_CLIENTS } from './grpc.registry';

@Module({})
export class GrpcModule {
	public static register(
		clients: Array<keyof typeof GRPC_CLIENTS>
	): DynamicModule {
		return {
			module: GrpcModule,
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
							const url = config.getOrThrow(cfg.env);

							const client = factory.createClient({
								package: cfg.package,
								protoPath: cfg.protoPath,
								url
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
