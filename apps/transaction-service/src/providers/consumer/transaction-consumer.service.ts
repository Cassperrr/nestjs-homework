import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TxServiceEnv } from '@transaction-service/src/config';
import {
	OutboxRepository,
	TransactionRepository
} from '@transaction-service/src/repositories';
import type { EachMessagePayload } from 'kafkajs';
import {
	AbstractKafkaConsumerService,
	type BalanceDepositFailedEvent,
	type BalanceDepositSuccessEvent,
	BalanceTranferFailedEvent,
	BalanceTranferSuccessEvent,
	type KafkaTopic,
	KafkaTopics
} from 'libs/kafka';
import { TransactionStatus } from 'shared';

@Injectable()
export class TransactionConsumerService extends AbstractKafkaConsumerService {
	private readonly MAX_RETRY: number;

	public constructor(
		private readonly txRepo: TransactionRepository,
		private readonly outboxRepo: OutboxRepository,
		private readonly config: ConfigService<TxServiceEnv, true>
	) {
		super();
		this.MAX_RETRY = this.config.get('MAX_RETRY', { infer: true });
	}

	protected async handleMessage(
		topic: KafkaTopic,
		payload: EachMessagePayload
	): Promise<void> {
		switch (topic) {
			case KafkaTopics.BALANCE_UPDATED_SUCCESS: {
				const event =
					this.parseMessage<BalanceDepositSuccessEvent>(payload);
				return this.handleBalanceUpdatedSuccess(event);
			}
			case KafkaTopics.BALANCE_UPDATED_FAILED: {
				const event =
					this.parseMessage<BalanceDepositFailedEvent>(payload);
				return this.handleBalanceUpdateFailed(event);
			}
			case KafkaTopics.BALANCE_TRANSFER_SUCCESS: {
				const event =
					this.parseMessage<BalanceTranferSuccessEvent>(payload);
				return this.handleBalanceTransferSuccess(event);
			}
			case KafkaTopics.BALANCE_TRANSFER_FAILED: {
				const event =
					this.parseMessage<BalanceTranferFailedEvent>(payload);
				return this.handleBalanceTransferFailed(event);
			}
		}
	}

	private async handleBalanceUpdatedSuccess(
		event: BalanceDepositSuccessEvent
	) {
		const { transactionId } = event;

		this.logger.log(
			`[${KafkaTopics.BALANCE_UPDATED_SUCCESS}] [transactionId=${transactionId}] Попытка изменения статуса у транзакции...`
		);

		try {
			await this.txRepo.updateById(transactionId, {
				status: TransactionStatus.BALANCE_UPDATED
			});

			this.logger.log(
				`[${KafkaTopics.BALANCE_UPDATED_SUCCESS}] [transactionId=${transactionId}] Статус транзакции -> "${TransactionStatus.BALANCE_UPDATED}"`
			);
		} catch (error) {
			this.logger.error(
				`[${KafkaTopics.BALANCE_UPDATED_SUCCESS}] [transactionId=${transactionId}] Ошибка изменения статуса транзакции`,
				error
			);
			// TODO DLQ
		}
	}

	public async handleBalanceUpdateFailed(event: BalanceDepositSuccessEvent) {
		const { transactionId, eventId } = event;

		this.logger.log(
			`[${KafkaTopics.BALANCE_UPDATED_FAILED}] [eventId=${eventId}] Попытка снова отправить событие в очередь...`
		);

		try {
			const updated =
				await this.outboxRepo.switchEventToUnprocessed(eventId);

			const isFailed = updated.retryCount >= this.MAX_RETRY;

			if (isFailed) {
				await this.outboxRepo.switchEventToFailed(
					eventId,
					transactionId
				);

				this.logger.error(
					`[${KafkaTopics.BALANCE_UPDATED_FAILED}] [eventId=${eventId}] FAILED после ${this.MAX_RETRY} попыток. Статус транзакции -> "${TransactionStatus.BALANCE_FAILED}". Требуется ручное вмешательство.`
				);
				// TODO: алерт + DLQ
			} else {
				this.logger.warn(
					`[${KafkaTopics.BALANCE_UPDATED_FAILED}] [eventId=${eventId}] failed, retry ${updated.retryCount}/${this.MAX_RETRY}`
				);
			}
		} catch (error) {
			this.logger.error(
				`[${KafkaTopics.BALANCE_UPDATED_FAILED}] [eventId=${eventId}] Ошибка при поптыке отправить событие снова в очередь`,
				error
			);
			// TODO DLQ
		}
	}

	private async handleBalanceTransferSuccess(
		event: BalanceTranferSuccessEvent
	) {
		const { outId, inId } = event;

		this.logger.log(
			`[${KafkaTopics.BALANCE_TRANSFER_SUCCESS}] [outId=${outId}] [inId=${inId}] Попытка изменения статусов у транзакций...`
		);

		try {
			await this.txRepo.updateStatusByIds(outId, inId);

			this.logger.log(
				`[${KafkaTopics.BALANCE_TRANSFER_SUCCESS}] [outId=${outId}] [inId=${inId}] Статус транзакции -> "${TransactionStatus.BALANCE_UPDATED}"`
			);
		} catch (error) {
			this.logger.error(
				`[${KafkaTopics.BALANCE_UPDATED_SUCCESS}] [outId=${outId}] [inId=${inId}] Ошибка изменения статуса транзакции`,
				error
			);
			// TODO DLQ
		}
	}

	public async handleBalanceTransferFailed(event: BalanceTranferFailedEvent) {
		const { eventId, outId, inId } = event;

		this.logger.log(
			`[${KafkaTopics.BALANCE_UPDATED_FAILED}] [outId=${outId}] [inId=${inId}] [eventId=${eventId}] Попытка снова отправить событие в очередь...`
		);

		try {
			const updated =
				await this.outboxRepo.switchEventToUnprocessed(eventId);

			const isFailed = updated.retryCount >= this.MAX_RETRY;

			if (isFailed) {
				await this.outboxRepo.switchEventAndTxsToFailed(
					eventId,
					outId,
					inId
				);

				this.logger.error(
					`[${KafkaTopics.BALANCE_UPDATED_FAILED}] [outId=${outId}] [inId=${inId}] [eventId=${eventId}] FAILED после ${this.MAX_RETRY} попыток. Статус транзакции -> "${TransactionStatus.BALANCE_FAILED}". Требуется ручное вмешательство.`
				);
				// TODO: алерт + DLQ
			} else {
				this.logger.warn(
					`[${KafkaTopics.BALANCE_UPDATED_FAILED}] [outId=${outId}] [inId=${inId}] [eventId=${eventId}] failed, retry ${updated.retryCount}/${this.MAX_RETRY}`
				);
			}
		} catch (error) {
			this.logger.error(
				`[${KafkaTopics.BALANCE_UPDATED_FAILED}] [outId=${outId}] [inId=${inId}] [eventId=${eventId}] Ошибка при поптыке отправить событие снова в очередь`,
				error
			);
			// TODO DLQ
		}
	}
}
