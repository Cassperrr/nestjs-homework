import { KAFKA_TOPICS } from '@contracts';
import { Injectable, Logger } from '@nestjs/common';
import type { ClientKafka } from '@nestjs/microservices';
import { BalanceRepository } from '@user-service/src/core';
import {
	DepositCompletedEvent,
	KafkaProducerService,
	KafkaTopics,
	TransferPendingEvent
} from 'libs/kafka';
import { InjectKafkaProducer } from 'libsV2/kafka';

@Injectable()
export class BalanceKafkaService {
	private readonly logger = new Logger(BalanceKafkaService.name);

	public constructor(
		@InjectKafkaProducer()
		private readonly kafkaProducer: ClientKafka,

		private readonly balanceRepo: BalanceRepository
	) {}

	public async depositCompleted(event: DepositCompletedEvent) {
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
			this.kafkaProducer.emit(KAFKA_TOPICS.DEPOSIT_SUCCESS, {
				key: eventId,
				value: { eventId, transactionId }
			});

			this.logger.log(
				`[${KafkaTopics.TX_DEPOSIT_COMPLETED}] [accountId=${accountId}] [transactionId=${transactionId}] [${amountInt} ${currency}] Баланс успешно начислен`
			);
		} catch (error) {
			this.logger.error(
				`[${KafkaTopics.TX_DEPOSIT_COMPLETED}] [accountId=${accountId}] [transactionId=${transactionId}] [${amountInt} ${currency}] Ошибка начисления баланса`,
				error
			);

			// здесь публикация провала
			this.kafkaProducer.emit(KAFKA_TOPICS.DEPOSIT_FAILED, {
				key: eventId,
				value: { eventId, transactionId }
			});
		}
	}

	public async transferPending(event: TransferPendingEvent) {
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

			this.kafkaProducer.emit(KAFKA_TOPICS.TRANFER_SUCCESS, {
				key: eventId,
				value: { eventId, outId, inId }
			});

			this.logger.log(
				`[${KafkaTopics.TX_TRANSFER_PENDING}] [fromAccountId=${fromAccountId}] [toAccountId=${toAccountId}] [outId=${outId}] [inId=${inId}] [${amountInt} ${currency}] Перевод выполнен`
			);
		} catch (error) {
			this.logger.error(
				`[${KafkaTopics.TX_TRANSFER_PENDING}] [fromAccountId=${fromAccountId}] [toAccountId=${toAccountId}] [outId=${outId}] [inId=${inId}] [${amountInt} ${currency}] Ошибка перевода средств`,
				error
			);
			// здесь публикация провала
			this.kafkaProducer.emit(KAFKA_TOPICS.TRANFER_FAILED, {
				key: eventId,
				value: { eventId, outId, inId }
			});
		}
	}
}
