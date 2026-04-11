import {
	GatewayTimeoutException,
	type HttpException,
	Logger,
	type OnModuleInit,
	ServiceUnavailableException
} from '@nestjs/common';
import type { Request, RequestHandler, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import type { CircuitState, ProxyReqHandler } from './interfaces';

/**
 * Абстрактный класс клиента для проксирования запросов на микросервис.
 * Имеет встроенный circuit breaker.
 */
export abstract class AbstractProxyClient implements OnModuleInit {
	private readonly logger = new Logger(this.constructor.name);
	private proxy!: RequestHandler;
	private probeTimeout?: NodeJS.Timeout;

	// circuit breaker
	private state: CircuitState = 'closed';
	private failures = 0;
	private circuitOpenedAt: number | null = null;
	private probeInFlight = false;

	public constructor(
		private readonly url: string,
		private readonly FAILURE_THRESHOLD: number,
		private readonly RESET_AFTER_MS: number,
		private readonly PROXY_TIMEOUT_MS: number,
		private readonly onProxyReq: ProxyReqHandler
	) {}

	public onModuleInit(): void {
		this.proxy = createProxyMiddleware({
			target: this.url,
			changeOrigin: true,
			proxyTimeout: this.PROXY_TIMEOUT_MS,
			timeout: this.PROXY_TIMEOUT_MS + 2_000,
			selfHandleResponse: false,
			on: {
				proxyReq: (proxyReq, req: Request) => {
					this.onProxyReq(proxyReq, req);
				},
				proxyRes: proxyRes => {
					if (proxyRes.statusCode && proxyRes.statusCode < 500) {
						this.success();
					} else {
						this.failure(new Error(`HTTP ${proxyRes.statusCode}`));
					}
				},
				error: (err: any, _req: Request, res: any) => {
					const error =
						err instanceof Error ? err : new Error(String(err));

					this.failure(error);

					if (!res.headersSent) {
						const mapped = this.mapError(error);

						res.status(mapped.getStatus()).json({
							statusCode: mapped.getStatus(),
							message: mapped.message
						});
					}
				}
			}
		});
	}

	public proxyToService(req: Request, res: Response): Promise<void> {
		// если circuit открыт - не дрочим сервис
		if (this.isCircuitOpen()) {
			this.logger.warn(`Circuit ${this.state}: запрос отклонён`);
			throw new ServiceUnavailableException(
				`Сервис временно недоступен, попробуйте позже`
			);
		}

		return new Promise<void>(resolve => {
			/* eslint-disable */
			this.proxy(req, res, err => {
				if (!err) return resolve();

				const error =
					err instanceof Error ? err : new Error(String(err));

				// this.failure(error);

				if (!res.headersSent) {
					const mapped = this.mapError(error);

					res.status(mapped.getStatus()).json({
						error: mapped.message
					});
				}

				resolve();
			});
		});
	}

	// ─── Circuit Breaker ───────────────────────────────────────────────

	private isCircuitOpen(): boolean {
		switch (this.state) {
			case 'closed':
				return false;

			case 'open':
				if (Date.now() - this.circuitOpenedAt! <= this.RESET_AFTER_MS) {
					return true;
				}
				this.state = 'half-open';
				this.logger.log('Circuit → half-open, пробный запрос');
				this.probeInFlight = true;
				this.startProbeTimeout();
				return false;

			// eslint-disable-next-line no-fallthrough
			case 'half-open':
				if (this.probeInFlight) return true;
				// сюда попадаем если зонд завис и был сброшен таймаутом
				this.probeInFlight = true;
				this.startProbeTimeout();
				return false;
		}
	}

	private startProbeTimeout(): void {
		if (this.probeTimeout) {
			clearTimeout(this.probeTimeout);
		}

		this.probeTimeout = setTimeout(() => {
			if (this.probeInFlight) {
				this.logger.warn('Probe завис → failure');

				this.failure(new Error('Probe timeout'));
			}
		}, this.PROXY_TIMEOUT_MS + 1000);
	}

	private success(): void {
		if (this.state !== 'closed') {
			this.logger.log(`Circuit закрыт: сервис восстановлен`);
		}

		this.state = 'closed';
		this.failures = 0;
		this.probeInFlight = false;
		this.circuitOpenedAt = null;

		if (this.probeTimeout) {
			clearTimeout(this.probeTimeout);
			this.probeTimeout = undefined;
		}
	}

	private failure(err: Error): void {
		// если half-open и зонд уже не летит — дубликат, игнорируем
		if (this.state === 'half-open' && !this.probeInFlight) {
			this.logger.warn(
				`Duplicate failure ignored in half-open: ${err.message}`
			);
			return;
		}

		this.probeInFlight = false; // сбрасываем зонд

		// в half-open один фейл сразу открывает circuit, не накапливаем
		if (this.state === 'half-open') {
			this.state = 'open';
			this.circuitOpenedAt = Date.now();
			this.failures = 0;
			this.logger.error(
				`Probe failed → Circuit открыт снова, повтор через ${this.RESET_AFTER_MS / 1000}s`
			);
			if (this.probeTimeout) {
				clearTimeout(this.probeTimeout);
				this.probeTimeout = undefined;
			}
			return;
		}

		this.failures++;
		this.logger.warn(
			`Ошибка [${this.failures}/${this.FAILURE_THRESHOLD}]: ${err.message}`
		);

		if (this.failures >= this.FAILURE_THRESHOLD) {
			this.state = 'open';
			this.circuitOpenedAt = Date.now();
			this.failures = 0;
			this.logger.error(
				`Circuit открыт: сервис недоступен, повтор через ${this.RESET_AFTER_MS / 1000}s`
			);
		}

		if (this.probeTimeout) {
			clearTimeout(this.probeTimeout);
			this.probeTimeout = undefined;
		}
	}

	// ─── Helpers ───────────────────────────────────────────────────────

	private mapError(err: Error): HttpException {
		if (err.message.includes('ECONNREFUSED'))
			return new ServiceUnavailableException(`Сервис недоступен`);
		if (
			err.message.includes('ETIMEDOUT') ||
			err.message.includes('timeout')
		)
			return new GatewayTimeoutException(`Сервис не ответил`);
		return new ServiceUnavailableException(`Ошибка сервиса`);
	}
}
