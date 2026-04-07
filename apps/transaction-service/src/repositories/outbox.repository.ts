import { Injectable } from '@nestjs/common';
import {
	type OutboxEvent,
	PrismaClient
} from '@transaction-service/prisma/generated/client';
import { InjectPrismaClient } from 'libs/prisma';
import { TransactionStatus } from 'shared';

@Injectable()
export class OutboxRepository {
	public constructor(
		@InjectPrismaClient() private readonly prisma: PrismaClient
	) {}

	public findUnprocessedEvents(batchSize: number) {
		return this.prisma.outboxEvent.findMany({
			where: { processed: false, failedAt: null },
			orderBy: { createdAt: 'asc' },
			take: batchSize
		});
	}

	public switchEventToProcessed(id: string) {
		return this.prisma.outboxEvent.update({
			where: { id },
			data: {
				processed: true,
				processedAt: new Date()
			}
		});
	}

	public switchEventToUnprocessed(id: string) {
		return this.prisma.outboxEvent.update({
			where: { id },
			data: {
				processed: false,
				retryCount: { increment: 1 },
				processedAt: null
			},
			select: {
				retryCount: true
			}
		});
	}

	public switchEventToFailed(id: string, txId: string) {
		return this.prisma.$transaction(async tx => {
			await tx.outboxEvent.update({
				where: { id },
				data: {
					failedAt: new Date()
				}
			});

			await tx.transaction.update({
				where: { id: txId },
				data: { status: TransactionStatus.BALANCE_FAILED }
			});
		});
	}

	public switchEventAndTxsToFailed(id: string, outId: string, inId: string) {
		return this.prisma.$transaction(async tx => {
			await tx.outboxEvent.update({
				where: { id },
				data: {
					failedAt: new Date()
				}
			});

			await tx.transaction.update({
				where: { id: outId },
				data: { status: TransactionStatus.BALANCE_FAILED }
			});

			await tx.transaction.update({
				where: { id: inId },
				data: { status: TransactionStatus.BALANCE_FAILED }
			});
		});
	}
}
