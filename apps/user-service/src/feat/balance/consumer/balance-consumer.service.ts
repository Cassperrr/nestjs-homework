import { Injectable, Logger } from '@nestjs/common';
import { BalanceRepository } from '@user-service/src/core';
import type { EachMessagePayload } from 'kafkajs';
import {
	AbstractKafkaConsumerService,
	type DepositCompletedEvent,
	type KafkaTopic,
	KafkaTopics
} from 'libs/kafka';

@Injectable()
export class BalanceConsumerService extends AbstractKafkaConsumerService {
	public constructor(private readonly balanceRepo: BalanceRepository) {
		super();
	}

	protected getTopics(): KafkaTopic[] {
		return [KafkaTopics.TX_DEPOSIT_COMPLETED];
	}

	protected async handleMessage(
		topic: KafkaTopic,
		payload: EachMessagePayload
	): Promise<void> {
		switch (topic) {
			case KafkaTopics.TX_DEPOSIT_COMPLETED: {
				const event = this.parseMessage<DepositCompletedEvent>(payload);
				return this.handleDepositCompleted(event);
			}
		}
	}

	private async handleDepositCompleted(event: DepositCompletedEvent) {
		const { accountId, amount, currency, transactionId } = event;

		this.logger.log(
			`[accountId=${accountId}] [transactionId=${transactionId}] [${KafkaTopics.TX_DEPOSIT_COMPLETED}] Обработка начисления баланса...`
		);
		try {
			const updated = await this.balanceRepo.deposit(
				transactionId,
				currency,
				BigInt(amount),
				accountId,
				KafkaTopics.TX_DEPOSIT_COMPLETED
			);

			if (!updated) throw Error('Обновленный объект баланса не получен');

			// здесь публикация успеха

			this.logger.log(
				`[accountId=${accountId}] [transactionId=${transactionId}] [${KafkaTopics.TX_DEPOSIT_COMPLETED}] Баланс успешно начислен`
			);
		} catch (error) {
			this.logger.log(
				`[accountId=${accountId}] [transactionId=${transactionId}] [${KafkaTopics.TX_DEPOSIT_COMPLETED}] Ошибка начисления баланса`,
				error
			);

			// здесь публикация провала
		}
	}
}
