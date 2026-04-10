import { KAFKA_TOPICS } from '@contracts';
import { Injectable } from '@nestjs/common';
import {
	Prisma,
	PrismaClient,
	Transaction
} from '@transaction-service/prisma/generated/client';
import { InjectPrismaClient } from 'libsV2/prisma';
import { TransactionStatus } from 'shared';
import { uuidv7 } from 'uuidv7';

type TxDataForCreateEvent = Pick<
	Transaction,
	'id' | 'status' | 'accountId' | 'amount' | 'currency'
>[];

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
						transactionId: id,
						idempotencyKey: uuidv7(),
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
}
