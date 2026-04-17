import { KAFKA_TOPICS } from '@contracts';
import { Injectable } from '@nestjs/common';
import {
	Prisma,
	PrismaClient,
	Transaction
} from '@transaction-service/prisma/generated/client';
import { InjectPrismaClient } from 'libs/prisma';
import { TransactionStatus, TransactionType } from 'shared';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class TransactionRepository {
	public constructor(
		@InjectPrismaClient() private readonly prisma: PrismaClient
	) {}

	public create(data: Prisma.TransactionCreateInput) {
		return this.prisma.$transaction(async tx => {
			const existing = await tx.transaction.findUnique({
				where: { idempotencyKey: data.idempotencyKey },
				select: { id: true }
			});
			if (existing) return existing;

			return tx.transaction.create({ data, select: { id: true } });
		});
	}

	public createTransfer(
		fromAccountId: string,
		toAccountId: string,
		amount: bigint,
		currency: string,
		idempotencyKey: string
	) {
		return this.prisma.$transaction(async tx => {
			// проверяем уникальность транзы
			const existingTx = await tx.transaction.findUnique({
				where: { idempotencyKey }
			});
			// соблюдаем идемпотентность
			if (existingTx) return existingTx;

			// создаем тх
			const outId = uuidv7();
			const inId = uuidv7();

			const txOut = await tx.transaction.create({
				data: {
					id: outId,
					accountId: fromAccountId,
					amount: -amount,
					currency,
					type: TransactionType.TRANSFER_OUT,
					status: TransactionStatus.PENDING,
					idempotencyKey,
					referenceId: inId
				}
			});

			await tx.transaction.create({
				data: {
					id: inId,
					accountId: toAccountId,
					amount,
					currency,
					type: TransactionType.TRANSFER_IN,
					status: TransactionStatus.PENDING,
					idempotencyKey: `${idempotencyKey}_in`,
					referenceId: outId
				}
			});

			const eventId = uuidv7();

			await tx.outboxEvent.create({
				data: {
					id: eventId,
					transactionId: outId,
					topic: KAFKA_TOPICS.TRANSFER_INITED,
					payload: {
						eventId,
						outId,
						inId,
						fromAccountId,
						toAccountId,
						currency,
						amount: amount.toString()
					}
				}
			});

			return txOut;
		});
	}

	public setStatusCompletedAndCreateOutboxEvent(providerPaymentId: string) {
		return this.prisma.$transaction(async tx => {
			// === лочим и сразу читаем актуальные данные ===
			const [row] = await tx.$queryRaw<
				{
					id: string;
					accountId: string;
					amount: bigint;
					currency: string;
					status: string;
				}[]
			>(
				Prisma.sql`
					SELECT id, status, account_id AS "accountId", amount, currency 
					FROM transactions 
					WHERE provider_payment_id = ${providerPaymentId} 
					FOR UPDATE
				`
			);

			if (!row)
				throw new Error(
					`[providerPaymentId=${providerPaymentId}] Транзакция не найдена`
				);

			const { id, accountId, amount, currency, status } = row;
			const newStatus = TransactionStatus.COMPLETED;
			const topic = KAFKA_TOPICS.DEPOSIT_PAID_SUCCESS;
			const eventId = uuidv7();

			if (status !== TransactionStatus.PENDING)
				throw new Error(
					`[providerPaymentId=${providerPaymentId}] Статус транзакции не совпадает с текущим флоу: ${status} ->X ${newStatus}`
				);

			// === обновляем статус транзы ===
			await tx.transaction.update({
				where: { id },
				data: { status: newStatus }
			});

			// === создаем событие для воркера ===
			await tx.outboxEvent.create({
				data: {
					id: eventId,
					transactionId: id,
					topic,
					payload: {
						eventId,
						transactionId: id,
						accountId: accountId,
						currency: currency,
						amount: amount.toString()
					}
				}
			});

			return { id, status: newStatus, eventId, topic };
		});
	}

	public setStatusTimeout(providerPaymentId: string) {
		return this.prisma.$transaction(async tx => {
			const [row] = await tx.$queryRaw<
				{
					id: string;
					status: string;
				}[]
			>(
				Prisma.sql`
					SELECT id, status 
					FROM transactions 
					WHERE provider_payment_id = ${providerPaymentId} 
					FOR UPDATE
				`
			);

			if (!row)
				throw new Error(
					`[providerPaymentId=${providerPaymentId}] Транзакция не найдена`
				);

			const { id, status } = row;
			const newStatus = TransactionStatus.TIMEOUT;

			if (status !== TransactionStatus.PENDING)
				throw new Error(
					`[providerPaymentId=${providerPaymentId}] Статус транзакции не совпадает с текущим флоу: ${status} ->X ${newStatus}`
				);

			await tx.transaction.update({
				where: { id },
				data: { status: newStatus }
			});

			return { id, status: newStatus };
		});
	}

	public findUnprocessedEvents(limit: number) {
		return this.prisma.outboxEvent.findMany({
			where: { processed: false },
			orderBy: { createdAt: 'asc' },
			take: limit
		});
	}

	public markEventsAsProcessed(ids: string[]) {
		return this.prisma.outboxEvent.updateMany({
			where: { id: { in: ids } },
			data: { processed: true, processedAt: new Date() }
		});
	}

	public setStatusUpdatedAndCreateProcessedEvent(
		idempotencyKey: string,
		transactionId: string
	) {
		return this.prisma.$transaction(async tx => {
			const alreadyExist = await tx.processedEvent.findUnique({
				where: { idempotencyKey }
			});
			if (alreadyExist) return;

			const [row] = await tx.$queryRaw<
				{
					id: string;
					status: string;
				}[]
			>(
				Prisma.sql`
					SELECT id, status 
					FROM transactions 
					WHERE id = ${transactionId} 
					FOR UPDATE
				`
			);

			if (!row)
				throw new Error(
					`[transactionId=${transactionId}] Транзакция не найдена`
				);

			const { id, status } = row;
			const newStatus = TransactionStatus.BALANCE_UPDATED;

			if (status !== TransactionStatus.COMPLETED)
				throw new Error(
					`[transactionId=${transactionId}] Статус транзакции не совпадает с текущим флоу: ${status} ->X ${newStatus}`
				);

			await tx.transaction.update({
				where: { id },
				data: { status: newStatus }
			});

			await tx.processedEvent.create({
				data: {
					id: uuidv7(),
					idempotencyKey,
					topic: KAFKA_TOPICS.DEPOSIT_CREDITING_SUCCESS
				}
			});
		});
	}

	public async recreateOutboxEvent(
		idempotencyKey: string,
		transactionId: string,
		eventId: string,
		maxRetry: number,
		processedTopic: string
	) {
		let retriesExhausted = false;

		await this.prisma.$transaction(async tx => {
			const alreadyExist = await tx.processedEvent.findUnique({
				where: { idempotencyKey },
				select: { id: true }
			});
			if (alreadyExist) return;

			const transaction = await tx.transaction.findUnique({
				where: { id: transactionId },
				select: { id: true }
			});
			if (!transaction)
				throw Error(`Транзакция ${transactionId} не найдена`);

			const updated = await tx.transaction.update({
				where: { id: transactionId },
				data: { retryCount: { increment: 1 } },
				select: { retryCount: true }
			});

			if (updated.retryCount < maxRetry) {
				const event = await tx.outboxEvent.findUnique({
					where: { id: eventId }
				});
				if (!event) throw Error(`Event ${eventId} не найден`);
				if (!event.payload)
					throw Error(`Payload event ${eventId} не найден`);

				await tx.outboxEvent.create({
					data: {
						id: uuidv7(),
						transactionId: event.transactionId,
						topic: event.topic,
						payload: event.payload
					}
				});

				await tx.processedEvent.create({
					data: {
						id: uuidv7(),
						idempotencyKey,
						topic: processedTopic
					}
				});
			} else {
				await tx.transaction.update({
					where: { id: transactionId },
					data: { status: TransactionStatus.FAILED }
				});
				retriesExhausted = true;
			}
		});

		if (retriesExhausted) {
			throw Error(
				`Попытки опубликовать event исчерпаны | Статус транзакции -> ${TransactionStatus.FAILED}`
			);
		}
	}

	public async recreateTransferOutboxEvent(
		idempotencyKey: string,
		outId: string,
		inId: string,
		eventId: string,
		maxRetry: number,
		processedTopic: string
	) {
		let retriesExhausted = false;

		await this.prisma.$transaction(async tx => {
			const alreadyExist = await tx.processedEvent.findUnique({
				where: { idempotencyKey },
				select: { id: true }
			});
			if (alreadyExist) return;

			const txs = await tx.transaction.findMany({
				where: { id: { in: [outId, inId] } },
				select: { id: true }
			});
			if (txs.length < 2)
				throw new Error(
					`Одна из транзакций не найдена: ${outId} | ${inId} `
				);

			const updated = await tx.transaction.updateManyAndReturn({
				where: { id: { in: [outId, inId] } },
				data: { retryCount: { increment: 1 } },
				select: { retryCount: true }
			});

			if (updated[0].retryCount < maxRetry) {
				const event = await tx.outboxEvent.findUnique({
					where: { id: eventId }
				});
				if (!event) throw Error(`Event ${eventId} не найден`);
				if (!event.payload)
					throw Error(`Payload event ${eventId} не найден`);

				await tx.outboxEvent.create({
					data: {
						id: uuidv7(),
						transactionId: event.transactionId,
						topic: event.topic,
						payload: event.payload
					}
				});

				await tx.processedEvent.create({
					data: {
						id: uuidv7(),
						idempotencyKey,
						topic: processedTopic
					}
				});
			} else {
				await tx.transaction.updateMany({
					where: { id: { in: [outId, inId] } },
					data: { status: TransactionStatus.FAILED }
				});
				retriesExhausted = true;
			}
		});

		if (retriesExhausted) {
			throw Error(
				`Попытки опубликовать event исчерпаны | Статус транзакций -> ${TransactionStatus.FAILED}`
			);
		}
	}

	public setStatusUpdatedByIdsAndCreateProcessedEvent(
		idempotencyKey: string,
		outId: string,
		inId: string
	) {
		return this.prisma.$transaction(async tx => {
			const alreadyExist = await tx.processedEvent.findUnique({
				where: { idempotencyKey }
			});
			if (alreadyExist) return;

			const rows = await tx.$queryRaw<{ id: string }[]>`
					SELECT id 
					FROM transactions 
					WHERE id IN (${Prisma.join([outId, inId])}) 
					FOR UPDATE
				`;

			if (!rows || rows.length === 0)
				throw new Error(`Транзакции не найдены`);

			await tx.transaction.update({
				where: { id: outId },
				data: { status: TransactionStatus.BALANCE_UPDATED }
			});

			await tx.transaction.update({
				where: { id: inId },
				data: { status: TransactionStatus.BALANCE_UPDATED }
			});

			await tx.processedEvent.create({
				data: {
					id: uuidv7(),
					idempotencyKey,
					topic: KAFKA_TOPICS.TRANFER_SUCCESS
				}
			});
		});
	}
}
