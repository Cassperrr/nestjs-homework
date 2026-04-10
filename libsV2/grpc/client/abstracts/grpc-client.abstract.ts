import { Metadata } from '@grpc/grpc-js';
import type { OnModuleInit } from '@nestjs/common';
import { Logger, ServiceUnavailableException } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { GrpcStatus } from 'libsV2/grpc/utils';
import { lastValueFrom } from 'rxjs';
import { throwError, TimeoutError, timer } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

import type { UnwrapObservable } from './interfaces';

/**
 * Абстрактный класс для инициализации типизированного клиента gRPC.
 * В качестве generic принимает сгенерированный proto-интерфейс сервиса.
 */
export abstract class AbstractGrpcClient<
	S extends Record<string, any>
> implements OnModuleInit {
	protected service!: S;
	private readonly logger = new Logger(this.constructor.name);

	protected constructor(
		private readonly client: ClientGrpc,
		private readonly serviceName: string,
		private readonly token?: string
	) {}

	public onModuleInit() {
		this.service = this.client.getService<S>(this.serviceName);
		this.logger.warn(`Пакет клиента gRPC зарегистрирован`);
	}

	public async call<K extends keyof S>(
		method: K,
		payload: Parameters<S[K]>[0],
		options = { timeout: 3000, retries: 2, delay: 500 }
	): Promise<UnwrapObservable<ReturnType<S[K]>>> {
		const metadata = new Metadata();
		if (this.token) {
			metadata.add('authorization', `Bearer ${this.token}`);
		}

		const observable = this.service[method](payload, metadata).pipe(
			timeout(options.timeout),
			retry({
				count: options.retries,
				delay: (err, retryCount) => {
					const noRetryStatuses = [
						GrpcStatus.INVALID_ARGUMENT,
						GrpcStatus.NOT_FOUND,
						GrpcStatus.ALREADY_EXISTS,
						GrpcStatus.PERMISSION_DENIED,
						GrpcStatus.UNAUTHENTICATED
					];
					if (noRetryStatuses.includes(err?.code)) {
						throw err;
					}
					const exponential = Math.pow(2, retryCount) * options.delay;
					const jitter = Math.random() * options.delay;
					this.logger.debug(
						`Retrying ${String(method)} attempt ${retryCount}`
					);
					return timer(exponential + jitter);
				}
			}),
			catchError(err => {
				if (
					err instanceof TimeoutError ||
					err?.code === GrpcStatus.UNAVAILABLE
				) {
					// return throwError(
					// 	() =>
					// 		new ServiceUnavailableException(
					// 			'Service unavailable'
					// 		)
					// );
					return throwError(
						() =>
							new RpcException({
								code: GrpcStatus.UNAVAILABLE,
								details: 'Service unavailable'
							})
					);
				}
				return throwError(() => err);
			})
		);

		return lastValueFrom(observable) as UnwrapObservable<ReturnType<S[K]>>;
	}
}
