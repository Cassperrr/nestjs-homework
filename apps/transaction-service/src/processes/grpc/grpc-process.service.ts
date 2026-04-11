import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { TransactionRepository } from '@transaction-service/src/core';
import { BalanceClientGrpc } from '@transaction-service/src/infra';
import type { StringMessage } from 'contracts/grpc/gen/shared';
import type {
	DepositRubRequest,
	DepositRubResponse,
	TransferRubRequest
} from 'contracts/grpc/gen/transaction';
import { GrpcStatus } from 'libs/grpc';
import { YookassaService } from 'libs/payments';
import {
	Currency,
	PaymentMethods,
	PaymentProvider,
	TransactionStatus,
	TransactionType
} from 'shared';
import 'shared/extensions/bigint.extension';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class GrpcProcessService {
	private readonly logger = new Logger(GrpcProcessService.name);

	public constructor(
		private readonly balanceClient: BalanceClientGrpc,
		private readonly yookassaService: YookassaService,
		private readonly txRepo: TransactionRepository
	) {}

	public async depositRub(
		data: DepositRubRequest
	): Promise<DepositRubResponse> {
		const { accountId, idempotencyKey, amount } = data;

		const amountInt = BigInt(amount).toDollarsInt();

		const provider = PaymentProvider.YOOKASSA;
		const currency = Currency.RUB;
		const type = TransactionType.DEPOSIT;
		const method = PaymentMethods.YOOKASSA.BANK_CARD;

		// проверяем аккаунт и состояние баланса клиента
		await this.balanceClient
			.call('validationAccount', {
				accountId,
				currency
			})
			.catch(error => {
				if (
					error?.code === GrpcStatus.UNAVAILABLE ||
					error?.code === GrpcStatus.DEADLINE_EXCEEDED
				) {
					this.logger.error('Balance service недоступен', error);
					throw new RpcException({
						code: GrpcStatus.UNAVAILABLE,
						details: 'Balance service недоступен'
					});
				}
				throw error; // TODO протестить
			});

		// формируем объект оплаты
		const payment = await this.yookassaService
			.createPayment({
				amount: {
					value: amountInt,
					currency
				},
				payment_method_data: {
					type: method
				},
				description: 'Пополнение баланса в "NestJs project"',
				confirmation: {
					type: 'redirect',
					return_url: 'http://localhost:3000'
				},
				idempotencyKey,
				capture: true
			})
			.catch(error => {
				this.logger.error('Ошибка создания объекта оплаты', error);
				throw new RpcException({
					code: GrpcStatus.UNAVAILABLE,
					details: 'Ошибка создания ссылки на оплату'
				});
			});

		// првоеряем существование ссылки на оплату и payment id
		const paymentId = payment.id;
		if (!paymentId) {
			this.logger.error('Нет paymentId в ответе Yookassa.', payment);
			throw new RpcException({
				code: GrpcStatus.INTERNAL,
				details: 'Ошибка создания ссылки на оплату'
			});
		}
		const url = payment.confirmation.confirmation_url;
		if (!url) {
			this.logger.error('Нет сформированной ссылки на оплату', payment);
			throw new RpcException({
				code: GrpcStatus.INTERNAL,
				details: 'Ошибка создания ссылки на оплату'
			});
		}

		this.logger.log(
			`[${provider}] [${type}] [${amountInt} ${currency}] Ссылка на оплату готова | accountId=${accountId} | paymentId=${paymentId} | ${url}`
		);

		const tx = await this.txRepo.create({
			id: uuidv7(),
			accountId,
			amount: BigInt(amount),
			currency,
			idempotencyKey,
			provider,
			providerPaymentId: paymentId,
			type,
			method,
			status: TransactionStatus.PENDING
		});

		this.logger.log(
			`[${tx.id}] [${type}] Транзакция -> "${TransactionStatus.PENDING}" | accountId=${accountId} | ${amountInt} ${currency}`
		);

		return { url };
	}

	public async transferRub(data: TransferRubRequest): Promise<StringMessage> {
		const { accountId, idempotencyKey, amount, toAccountId } = data;
		if (accountId === toAccountId)
			throw new RpcException({
				code: GrpcStatus.INVALID_ARGUMENT,
				details: 'Нельзя переводить самому себе'
			});

		const amountInt = BigInt(amount).toDollarsInt();
		const currency = Currency.RUB;
		const type = TransactionType.TRANSFER_OUT;

		const [balanceOut] = await Promise.all([
			this.balanceClient.call('validationAccount', {
				accountId,
				currency
			}),
			this.balanceClient.call('validationAccount', {
				accountId: toAccountId,
				currency
			})
		]).catch(error => {
			if (
				error?.code === GrpcStatus.UNAVAILABLE ||
				error?.code === GrpcStatus.DEADLINE_EXCEEDED
			) {
				this.logger.error('Balance service недоступен', error);
				throw new RpcException({
					code: GrpcStatus.UNAVAILABLE,
					details: 'Balance service недоступен'
				});
			}
			throw error; // TODO протестить
		});

		if (BigInt(balanceOut.amount) < BigInt(amount))
			return {
				message: `Не хватает средств для перевода`
			};

		const tx = await this.txRepo.createTransfer(
			accountId,
			toAccountId,
			BigInt(amount),
			currency,
			idempotencyKey
		);

		this.logger.log(
			`[${tx.id}] [${type}] Транзакция -> "${TransactionStatus.PENDING}" | accountId=${accountId} | toAccountId=${toAccountId} | ${amountInt} ${currency}`
		);

		return {
			message:
				'Транзакция в обработке. Вы увидите ее статус исполнения в уведомлении Websocket (http://localhost:3003)'
		};
	}
}
