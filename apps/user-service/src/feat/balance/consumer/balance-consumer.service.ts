import { Injectable, Logger } from '@nestjs/common';
import { BalanceRepository } from '@user-service/src/core';
import type { EachMessagePayload } from 'kafkajs';
import {
	AbstractKafkaConsumerService,
	type DepositCompletedEvent,
	KafkaProducerService,
	type KafkaTopic,
	KafkaTopics,
	TransferPendingEvent
} from 'libs/kafka';
import 'shared/extensions/bigint.extension';

@Injectable()
export class BalanceConsumerService extends AbstractKafkaConsumerService {
	public constructor(
		private readonly balanceRepo: BalanceRepository,
		private readonly kafkaProducer: KafkaProducerService
	) {
		super();
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
			case KafkaTopics.TX_TRANSFER_PENDING: {
				const event = this.parseMessage<TransferPendingEvent>(payload);
				return this.handleTransferPending(event);
			}
		}
	}

	private async handleDepositCompleted(event: DepositCompletedEvent) {
		const { accountId, amount, currency, eventId, transactionId } = event;
		const amountInt = BigInt(amount).toDollarsInt();

		this.logger.log(
			`[${KafkaTopics.TX_DEPOSIT_COMPLETED}] [accountId=${accountId}] [transactionId=${transactionId}] [${amountInt} ${currency}] Обработка начисления баланса...`
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
			await this.kafkaProducer.publish(
				KafkaTopics.BALANCE_UPDATED_SUCCESS,
				{
					key: eventId,
					value: { eventId, transactionId }
				}
			);

			this.logger.log(
				`[${KafkaTopics.TX_DEPOSIT_COMPLETED}] [accountId=${accountId}] [transactionId=${transactionId}] [${amountInt} ${currency}] Баланс успешно начислен`
			);
		} catch (error) {
			this.logger.error(
				`[${KafkaTopics.TX_DEPOSIT_COMPLETED}] [accountId=${accountId}] [transactionId=${transactionId}] [${amountInt} ${currency}] Ошибка начисления баланса`,
				error
			);

			// здесь публикация провала
			await this.kafkaProducer
				.publish(KafkaTopics.BALANCE_UPDATED_FAILED, {
					key: eventId,
					value: { eventId, transactionId }
				})
				.catch(publishError => {
					this.logger.error(
						'Failed to publish BALANCE_UPDATED_FAILED',
						publishError
					);
					// TODO: DLQ
				});
		}
	}

	private async handleTransferPending(event: TransferPendingEvent) {
		const {
			outId,
			inId,
			fromAccountId,
			toAccountId,
			eventId,
			amount,
			currency
		} = event;
		const amountInt = BigInt(amount).toDollarsInt();

		this.logger.log(
			`[${KafkaTopics.TX_TRANSFER_PENDING}] [fromAccountId=${fromAccountId}] [toAccountId=${toAccountId}] [outId=${outId}] [inId=${inId}] [${amountInt} ${currency}] Обработка перевода средств...`
		);

		try {
			await this.balanceRepo.transfer(
				outId,
				fromAccountId,
				toAccountId,
				currency,
				BigInt(amount),
				KafkaTopics.TX_TRANSFER_PENDING
			);

			await this.kafkaProducer.publish(
				KafkaTopics.BALANCE_TRANSFER_SUCCESS,
				{
					key: eventId,
					value: { eventId, outId, inId }
				}
			);

			this.logger.log(
				`[${KafkaTopics.TX_TRANSFER_PENDING}] [fromAccountId=${fromAccountId}] [toAccountId=${toAccountId}] [outId=${outId}] [inId=${inId}] [${amountInt} ${currency}] Перевод выполнен`
			);
		} catch (error) {
			this.logger.error(
				`[${KafkaTopics.TX_TRANSFER_PENDING}] [fromAccountId=${fromAccountId}] [toAccountId=${toAccountId}] [outId=${outId}] [inId=${inId}] [${amountInt} ${currency}] Ошибка перевода средств`,
				error
			);
			// здесь публикация провала
			await this.kafkaProducer
				.publish(KafkaTopics.BALANCE_TRANSFER_FAILED, {
					key: eventId,
					value: { eventId, outId, inId }
				})
				.catch(publishError => {
					this.logger.error(
						'Failed to publish BALANCE_UPDATED_FAILED',
						publishError
					);
					// TODO: DLQ
				});
		}
	}
}
