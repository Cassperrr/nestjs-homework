import {
	Inject,
	Injectable,
	Logger,
	UnprocessableEntityException
} from '@nestjs/common';

import { YOOKASSA_OPTIONS } from '../constants';
import type {
	CreatePaymentRequest,
	CreatePaymentResponse,
	YookassaModuleOptions,
	YookassaPaymentObjectResponse
} from '../interfaces';

/**
 * Сервис для упрощенного взаимодействия с инфраструктурой Yookassa
 */
@Injectable()
export class YookassaService {
	private readonly logger = new Logger(YookassaService.name);
	private readonly baseUrl = 'https://api.yookassa.ru/v3';

	constructor(
		@Inject(YOOKASSA_OPTIONS)
		private readonly options: YookassaModuleOptions
	) {}

	private get authHeader(): string {
		return (
			'Basic ' +
			Buffer.from(
				`${this.options.shopId}:${this.options.secretKey}`
			).toString('base64')
		);
	}

	private async request<T>(
		method: 'GET' | 'POST',
		path: string,
		body?: unknown,
		idempotencyKey?: string
	): Promise<T> {
		const headers: Record<string, string> = {
			Authorization: this.authHeader,
			'Content-Type': 'application/json'
		};

		if (idempotencyKey) {
			headers['Idempotence-Key'] = idempotencyKey;
		}

		const res = await fetch(`${this.baseUrl}${path}`, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined
		});

		if (!res.ok) {
			const error = await res.json().catch(() => ({}));
			this.logger.error(
				`Yookassa error ${res.status}: ${JSON.stringify(error)}`
			);
			throw new UnprocessableEntityException(error);
		}

		return res.json() as Promise<T>;
	}

	public async createPayment(
		payload: CreatePaymentRequest
	): Promise<CreatePaymentResponse> {
		const payment = await this.request<CreatePaymentResponse>(
			'POST',
			'/payments',
			payload,
			payload.idempotencyKey
		);
		// this.logger.debug('Payment created:', payment);
		return payment;
	}

	public async getPayment(
		paymentId: string
	): Promise<YookassaPaymentObjectResponse> {
		return this.request<YookassaPaymentObjectResponse>(
			'GET',
			`/payments/${paymentId}`
		);
	}
}
