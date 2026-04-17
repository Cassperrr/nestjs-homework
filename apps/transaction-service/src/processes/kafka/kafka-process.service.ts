import {
	type DepositCreditingFailedPayload,
	type DepositCreditingSuccessPayload,
	KAFKA_TOPICS,
	TransferFailedPayload,
	TransferSuccessPayload
} from '@contracts';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { KafkaContext } from '@nestjs/microservices';
import type { TxServiceEnv } from '@transaction-service/src/config';
import { TransactionRepository } from '@transaction-service/src/core';
import { TransactionStatus } from 'shared';

@Injectable()
export class KafkaProcessService {
	private readonly logger = new Logger(KafkaProcessService.name);

	private readonly MAX_RETRY: number;

	public constructor(
		private readonly txRepo: TransactionRepository,
		private readonly config: ConfigService<TxServiceEnv, true>
	) {
		this.MAX_RETRY = config.get('MAX_RETRY', { infer: true });
	}

	public async processingCreditingSuccess(
		payload: DepositCreditingSuccessPayload,
		ctx: KafkaContext
	) {
		const { transactionId, eventId } = payload;

		this.logger.log(
			`[${transactionId}] Изменение статуса транзакции -> ${TransactionStatus.BALANCE_UPDATED}...`
		);
		try {
			const idempotencyKey = ctx
				.getMessage()
				.headers?.idempotencyKey?.toString();

			if (!idempotencyKey) throw Error('Header "idempotencyKey" missing');

			await this.txRepo.setStatusUpdatedAndCreateProcessedEvent(
				idempotencyKey,
				transactionId
			);

			this.logger.log(
				`[${transactionId}] Статус -> ${TransactionStatus.BALANCE_UPDATED}`
			);
		} catch (err) {
			this.logger.error(
				`[${transactionId}] Ошибка изменения статуса транзакции -> ${TransactionStatus.BALANCE_UPDATED} | ТРЕБУЕТСЯ РУЧНОЕ ВМЕШАТЕЛЬСТВО`,
				err
			);

			// DLQ
		}
	}

	public async processingCreditingFailed(
		payload: DepositCreditingFailedPayload,
		ctx: KafkaContext
	) {
		const { transactionId, eventId } = payload;

		this.logger.log(
			`[${transactionId}] Обработка ошибки начисления депозита. Повторное создание event...`
		);

		try {
			const idempotencyKey = ctx
				.getMessage()
				.headers?.idempotencyKey?.toString();

			if (!idempotencyKey) throw Error('Header "idempotencyKey" missing');

			await this.txRepo.recreateOutboxEvent(
				idempotencyKey,
				transactionId,
				eventId,
				this.MAX_RETRY,
				KAFKA_TOPICS.DEPOSIT_CREDITING_FAILED
			);

			this.logger.log(
				`[${transactionId}] Event транзакции по начислению баланса повторно отправлен в очередь`
			);
		} catch (err) {
			this.logger.error(
				`[${transactionId}] Ошибка повторного создания event по начилению баланса | ТРЕБУЕТСЯ РУЧНОЕ ВМЕШАТЕЛЬСТВО`,
				err
			);

			// DLQ
		}
	}

	public async processingTransferSuccess(
		payload: TransferSuccessPayload,
		ctx: KafkaContext
	) {
		const { eventId, inId, outId } = payload;

		this.logger.log(
			`[${outId}] [${inId}] Изменение статуса транзакций -> ${TransactionStatus.BALANCE_UPDATED}...`
		);

		try {
			const idempotencyKey = ctx
				.getMessage()
				.headers?.idempotencyKey?.toString();

			if (!idempotencyKey) throw Error('Header "idempotencyKey" missing');

			await this.txRepo.setStatusUpdatedByIdsAndCreateProcessedEvent(
				idempotencyKey,
				outId,
				inId
			);
			this.logger.log(
				`[${outId}] [${inId}] Статусы -> ${TransactionStatus.BALANCE_UPDATED}`
			);
		} catch (err) {
			this.logger.error(
				`[${outId}] [${inId}] Ошибка изменения статусов транзакций -> ${TransactionStatus.BALANCE_UPDATED} | ТРЕБУЕТСЯ РУЧНОЕ ВМЕШАТЕЛЬСТВО`,
				err
			);

			// DLQ
		}
	}

	public async processingTransferFailed(
		payload: TransferFailedPayload,
		ctx: KafkaContext
	) {
		const { eventId, inId, outId } = payload;

		this.logger.log(
			`[${outId}] [${inId}] Обработка ошибки перевода средств...`
		);

		try {
			const idempotencyKey = ctx
				.getMessage()
				.headers?.idempotencyKey?.toString();

			if (!idempotencyKey) throw Error('Header "idempotencyKey" missing');

			await this.txRepo.recreateTransferOutboxEvent(
				idempotencyKey,
				outId,
				inId,
				eventId,
				this.MAX_RETRY,
				KAFKA_TOPICS.TRANFER_FAILED
			);

			this.logger.log(
				`[${outId}] [${inId}] Event транзакций по переводу средств повторно отправлен в очередь`
			);
		} catch (err) {
			this.logger.error(
				`[${outId}] [${inId}] Ошибка повторного создания event по переводу средств | ТРЕБУЕТСЯ РУЧНОЕ ВМЕШАТЕЛЬСТВО`,
				err
			);

			// DLQ
		}
	}
}
