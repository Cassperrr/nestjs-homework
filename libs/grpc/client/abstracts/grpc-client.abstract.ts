import type { OnModuleInit } from '@nestjs/common';
import { Logger, ServiceUnavailableException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcStatus } from 'libs/grpc/utils';
import { lastValueFrom, type Observable } from 'rxjs';
import { throwError, TimeoutError, timer } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

type UnwrapObservable<U> = U extends Observable<infer R> ? R : U;

export abstract class AbstractGrpcClient<
	T extends Record<string, any>
> implements OnModuleInit {
	protected service!: T;
	private readonly logger = new Logger('GrpcClient');

	protected constructor(
		private readonly client: ClientGrpc,
		private readonly serviceName: string
	) {}

	public onModuleInit() {
		this.service = this.client.getService<T>(this.serviceName);
	}

	public async call<K extends keyof T>(
		method: K,
		payload: Parameters<T[K]>[0],
		options = { timeout: 3000, retries: 2, delay: 500 }
	): Promise<UnwrapObservable<ReturnType<T[K]>>> {
		const observable = this.service[method](payload).pipe(
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
					return throwError(
						() =>
							new ServiceUnavailableException(
								'Service unavailable'
							)
					);
				}
				return throwError(() => err);
			})
		);

		return lastValueFrom(observable) as UnwrapObservable<ReturnType<T[K]>>;
	}
}
