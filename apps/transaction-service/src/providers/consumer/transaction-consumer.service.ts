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

	protected getTopics(): KafkaTopic[] {
		return [
			KafkaTopics.BALANCE_UPDATED_SUCCESS,
			KafkaTopics.BALANCE_UPDATED_FAILED
		];
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
		}
	}

	private async handleBalanceUpdatedSuccess(
		event: BalanceDepositSuccessEvent
	) {
		const { transactionId } = event;

		this.logger.log(
			`[transactionId=${transactionId}] [${KafkaTopics.BALANCE_UPDATED_SUCCESS}] Попытка изменения статуса у транзакции...`
		);

		try {
			await this.txRepo.updateById(transactionId, {
				status: TransactionStatus.BALANCE_UPDATED
			});

			this.logger.log(
				`[transactionId=${transactionId}] [${KafkaTopics.BALANCE_UPDATED_SUCCESS}] Статус транзакции -> "${TransactionStatus.BALANCE_UPDATED}"`
			);
		} catch (error) {
			this.logger.error(
				`[transactionId=${transactionId}] [${KafkaTopics.BALANCE_UPDATED_SUCCESS}] Ошибка изменения статуса транзакции`,
				error
			);
			// TODO DLQ
		}
	}

	public async handleBalanceUpdateFailed(event: BalanceDepositSuccessEvent) {
		const { transactionId, eventId } = event;

		this.logger.log(
			`[eventId=${eventId}] [${KafkaTopics.BALANCE_UPDATED_FAILED}] Попытка снова отправить событие в очередь...`
		);

		try {
			const updated =
				await this.outboxRepo.switchEventToUnprocessed(eventId);

			const isFailed = updated.retryCount >= this.MAX_RETRY;

			if (isFailed) {
				await this.outboxRepo.switchEventToFailed(eventId);
				await this.txRepo.updateById(transactionId, {
					status: TransactionStatus.BALANCE_FAILED
				});
				this.logger.error(
					`[eventId=${eventId}] [${KafkaTopics.BALANCE_UPDATED_FAILED}] FAILED после ${this.MAX_RETRY} попыток. Статус транзакции -> "${TransactionStatus.BALANCE_FAILED}". Требуется ручное вмешательство.`
				);
				// TODO: алерт + DLQ
			} else {
				this.logger.warn(
					`[eventId=${eventId}] [${KafkaTopics.BALANCE_UPDATED_FAILED}] failed, retry ${updated.retryCount}/${this.MAX_RETRY}`
				);
			}
		} catch (error) {
			this.logger.error(
				`[eventId=${eventId}] [${KafkaTopics.BALANCE_UPDATED_FAILED}] Ошибка при поптыке отправить событие снова в очередь`,
				error
			);
			// TODO DLQ
		}
	}
}
