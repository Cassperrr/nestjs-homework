import { GrpcStatus } from '@libs/grpc';
import { rethrowGrpcError } from '@libs/utils';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { BalanceClientGrpc } from '@transaction-service/src/infra';
import { TransactionRepository } from '@transaction-service/src/repositories';
import type {
	DepositRubRequest,
	DepositRubResponse
} from 'contracts/gen/transaction';
import { YookassaService } from 'libs/payments';
import {
	Currency,
	PaymentProvider,
	TransactionStatus,
	TransactionType
} from 'shared';
import 'shared/extensions/bigint.extension';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class TransactionGrpcService {
	private readonly logger = new Logger(TransactionGrpcService.name);

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

		try {
			// проверяем аккаунт и состояние баланса клиента
			await this.balanceClient.call('validationAccount', {
				accountId,
				currency: Currency.RUB
			});

			// формируем будущий id tx
			const transactionId = uuidv7();

			// формируем объект оплаты
			const payment = await this.yookassaService.createPayment({
				amount: {
					value: amountInt,
					currency: Currency.RUB
				},
				payment_method_data: {
					type: 'bank_card'
				},
				description: 'Пополнение баланса в "NestJs project"',
				confirmation: {
					type: 'redirect',
					return_url: 'http://localhost:3000'
				},
				metadata: { accountId, transactionId },
				idempotencyKey,
				capture: true
			});

			// првоеряем существование ссылки на оплату и payment id
			const paymentId = payment.id;
			const url = payment.confirmation.confirmation_url;
			if (!paymentId) throw new Error('Нет paymentId в ответе Yookassa');
			if (!url) throw new Error('Нет сформированной ссылки на оплату');

			// создаем транзакцию в бд
			await this.txRepo.create(
				transactionId,
				accountId,
				amount,
				Currency.RUB,
				TransactionType.DEPOSIT,
				TransactionStatus.PENDING,
				idempotencyKey,
				PaymentProvider.YOOKASSA,
				paymentId
			);

			this.logger.log(
				`[${PaymentProvider.YOOKASSA}] [${TransactionType.DEPOSIT}] [${Currency.RUB}] Ссылка на оплату получена | accountId=${accountId} | txId=${transactionId} | paymentId=${paymentId} | ${url}`
			);

			return { url };
		} catch (error) {
			rethrowGrpcError(error);

			this.logger.error(
				`[${PaymentProvider.YOOKASSA}] [${TransactionType.DEPOSIT}] [${Currency.RUB}] Ошибка получения ссылки на оплату | accountId=${accountId}`,
				error
			);

			throw new RpcException({
				code: GrpcStatus.CANCELLED,
				details: 'Ошибка создания платежа'
			});
		}
	}
}
