import { Injectable } from '@nestjs/common';
import {
	PrismaClient,
	type Transaction
} from '@transaction-service/prisma/generated/client';
import { KafkaTopics } from 'libs/kafka';
import { InjectPrismaClient } from 'libs/prisma';
import { TransactionStatus } from 'shared';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class TransactionRepository {
	public constructor(
		@InjectPrismaClient() private readonly prisma: PrismaClient
	) {}

	public findBy(params: { id?: string; providerPaymentId?: string }) {
		const { id, providerPaymentId } = params;

		return this.prisma.transaction.findFirst({
			where: {
				OR: [
					id ? { id } : undefined,
					providerPaymentId ? { providerPaymentId } : undefined
				].filter(Boolean) as any[]
			}
		});
	}

	public create(
		id: string,
		accountId: string,
		amount: bigint,
		currency: string,
		type: string,
		status: string,
		idempotencyKey: string,
		provider: string,
		providerPaymentId: string
	) {
		return this.prisma.$transaction(async tx => {
			// проверяем уникальность транзы
			const existingTx = await tx.transaction.findUnique({
				where: { idempotencyKey }
			});
			// соблюдаем идемпотентность
			if (existingTx) return existingTx;

			// создаем тх
			return this.prisma.transaction.create({
				data: {
					id,
					accountId,
					amount,
					currency,
					type,
					status,
					idempotencyKey,
					provider,
					providerPaymentId
				}
			});
		});
	}

	public setTxStatusCompleted(providerPaymentId: string) {
		return this.prisma.$transaction(async tx => {
			// лочим и сразу читаем актуальный статус
			const [row] = await tx.$queryRaw<
				{
					id: string;
					status: string;
					account_id: string;
					amount: string;
					currency: string;
				}[]
			>`
				SELECT id, status, account_id, amount, currency 
				FROM transactions 
				WHERE provider_payment_id = ${providerPaymentId} 
				FOR UPDATE
      `;

			if (!row)
				throw new Error(
					`Транзакция с providerPaymentId=${providerPaymentId} не найдена`
				);
			if (row.status !== TransactionStatus.PENDING) return;

			// обновляем статус транзы
			await tx.transaction.update({
				where: { id: row.id },
				data: { status: TransactionStatus.COMPLETED }
			});

			// создаем событие для воркера
			const eventId = uuidv7();

			await tx.outboxEvent.create({
				data: {
					id: eventId,
					transactionId: row.id,
					topic: KafkaTopics.TX_DEPOSIT_COMPLETED,
					payload: {
						eventId: eventId,
						transactionId: row.id,
						accountId: row.account_id,
						currency: row.currency,
						amount: row.amount.toString()
					}
				}
			});
		});
	}

	public updateByPaymentId(
		providerPaymentId: string,
		data: Partial<Transaction>
	) {
		return this.prisma.$transaction(async tx => {
			const [row] = await tx.$queryRaw<{ id: string }[]>`
				SELECT id 
				FROM transactions 
				WHERE provider_payment_id = ${providerPaymentId} 
				FOR UPDATE
      `;

			if (!row)
				throw new Error(
					`Транзакция с providerPaymentId=${providerPaymentId} не найдена`
				);

			await tx.transaction.update({
				where: { id: row.id },
				data
			});
		});
	}

	public updateById(id: string, data: Partial<Transaction>) {
		return this.prisma.$transaction(async tx => {
			const [row] = await tx.$queryRaw<{ id: string }[]>`
				SELECT id 
				FROM transactions 
				WHERE id = ${id} 
				FOR UPDATE
      `;

			if (!row) throw new Error(`Транзакция с id=${id} не найдена`);

			await tx.transaction.update({
				where: { id: row.id },
				data
			});
		});
	}
}
