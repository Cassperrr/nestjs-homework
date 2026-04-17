import {
	type DepositPaidSuccessPayload,
	KAFKA_TOPICS,
	RMQ_PATTERNS,
	TransferCompletedPayload,
	TransferInitedPayload
} from '@contracts';
import { Injectable, Logger } from '@nestjs/common';
import type { ClientRMQ, KafkaContext } from '@nestjs/microservices';
import { BalanceRepository } from '@user-service/src/core';
import { InjectRmqQueue } from 'libs/rmq';

@Injectable()
export class BalanceKafkaService {
	private readonly logger = new Logger(BalanceKafkaService.name);

	public constructor(
		@InjectRmqQueue('NOTIFICATION')
		private readonly notificationRmqQueue: ClientRMQ,
		private readonly balanceRepo: BalanceRepository
	) {}

	public async depositToBalance(
		payload: DepositPaidSuccessPayload,
		ctx: KafkaContext
	) {
		const { accountId, amount, currency, eventId, transactionId } = payload;

		this.logger.log(
			`[${accountId}] Обработка начисления депозита пользователю...`
		);

		try {
			const idempotencyKey = ctx
				.getMessage()
				.headers?.idempotencyKey?.toString();

			if (!idempotencyKey) throw Error('Header "idempotencyKey" missing');

			const amountInt = BigInt(amount).toDollarsInt();

			await this.balanceRepo.depositAndCreateOutboxEvent(
				idempotencyKey,
				currency,
				BigInt(amount),
				accountId,
				transactionId,
				eventId
			);

			this.logger.log(
				`[${accountId}] Депозит успешно начислен +${amountInt} ${currency}`
			);

			this.notificationRmqQueue.emit(RMQ_PATTERNS.DEPOSIT_CREDITED, {
				transactionId,
				accountId,
				amount: amountInt.toString(),
				currency
			});
		} catch (err) {
			this.logger.error(
				`[${accountId}] Ошибка начиления депозита пользователю | Создание события "${KAFKA_TOPICS.DEPOSIT_CREDITING_FAILED}"...`,
				err
			);

			const event = await this.balanceRepo
				.createOutboxEvent(
					accountId,
					currency,
					KAFKA_TOPICS.DEPOSIT_CREDITING_FAILED,
					{ eventId, transactionId }
				)
				.catch(err => {
					this.logger.error(
						`[${accountId}] Ошибка создания события "${KAFKA_TOPICS.DEPOSIT_CREDITING_FAILED}" | WRITING TO DLQ...`,
						err
					);
					// запись в DLQ
					console.log(payload);
					throw err;
				});

			this.logger.log(`[${accountId}] Событие "${event.topic}" создано`);
		}
	}

	public async transferToAccount(
		payload: TransferInitedPayload,
		ctx: KafkaContext
	) {
		const {
			outId,
			inId,
			fromAccountId,
			toAccountId,
			eventId,
			amount,
			currency
		} = payload;

		this.logger.log(
			`[${fromAccountId}] Обработка перевода средств пользователю -> ${toAccountId}...`
		);

		try {
			// throw new Error('ПИЗДА РУЛЯМ');
			const idempotencyKey = ctx
				.getMessage()
				.headers?.idempotencyKey?.toString();

			if (!idempotencyKey) throw Error('Header "idempotencyKey" missing');

			const amountInt = BigInt(amount).toDollarsInt();

			await this.balanceRepo.transferAndCreateOutboxEvent(
				idempotencyKey,
				fromAccountId,
				toAccountId,
				currency,
				BigInt(amount),
				eventId,
				outId,
				inId
			);

			this.logger.log(
				`[${fromAccountId}] Перевод средств успешен ${amountInt} ${currency} -> ${toAccountId}`
			);

			this.notificationRmqQueue.emit(RMQ_PATTERNS.TRANSFER_COMPLETED, {
				outTx: outId,
				inTx: inId,
				fromAccountId,
				toAccountId,
				amount: amountInt.toString(),
				currency
			});
		} catch (err) {
			this.logger.error(
				`[${fromAccountId}] Ошибка перевода средств пользователю ${toAccountId} | Создание события "${KAFKA_TOPICS.TRANFER_FAILED}"...`,
				err
			);

			const event = await this.balanceRepo
				.createOutboxEvent(
					fromAccountId,
					currency,
					KAFKA_TOPICS.TRANFER_FAILED,
					{ eventId, outId, inId }
				)
				.catch(err => {
					this.logger.error(
						`[${fromAccountId}] Ошибка создания события "${KAFKA_TOPICS.TRANFER_FAILED}" | WRITING TO DLQ...`,
						err
					);
					// запись в DLQ
					console.log(payload);
					throw err;
				});

			this.logger.log(
				`[${fromAccountId}] Событие "${event.topic}" создано`
			);
		}
	}
}
