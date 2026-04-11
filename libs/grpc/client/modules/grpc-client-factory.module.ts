import { type DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	type ClientGrpc,
	ClientProxyFactory,
	Transport
} from '@nestjs/microservices';
import { createClientToken } from 'libs/grpc/client/utils';
import { GRPC_CLIENTS } from 'registries';

/**
 * Фабрика gRPC клиентов.
 * Зависит от реестра клиентов и регистрирует переданные пакеты.
 */
@Module({})
export class GrpcClientFactoryModule {
	public static registerAsync(
		clients: Array<keyof typeof GRPC_CLIENTS>
	): DynamicModule {
		return {
			module: GrpcClientFactoryModule,
			providers: [
				...clients.map(token => {
					const client = GRPC_CLIENTS[token];
					return {
						provide: createClientToken(token),
						useFactory: (config: ConfigService) => {
							const url = config.getOrThrow(client.env.url);
							const timeMs = config.getOrThrow(client.env.timeMs);
							const timeoutMs = config.getOrThrow(
								client.env.timeoutMs
							);
							const deadlineSec = config.getOrThrow(
								client.env.deadlineSec
							);
							return ClientProxyFactory.create({
								transport: Transport.GRPC,
								options: {
									package: client.package,
									protoPath: client.protoPath,
									url,
									channelOptions: {
										'grpc.keepalive_time_ms': timeMs,
										'grpc.keepalive_timeout_ms': timeoutMs,
										'grpc.connect_deadline_seconds':
											deadlineSec
									}
								}
							}) as ClientGrpc;
						},
						inject: [ConfigService]
					};
				})
			],
			exports: [...clients.map(token => createClientToken(token))]
		};
	}
}
