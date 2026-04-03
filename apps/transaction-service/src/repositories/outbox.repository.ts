import { Injectable } from '@nestjs/common';
import {
	type OutboxEvent,
	PrismaClient
} from '@transaction-service/prisma/generated/client';
import { InjectPrismaClient } from 'libs/prisma';

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

	public switchEventToFailed(id: string) {
		return this.prisma.outboxEvent.update({
			where: { id },
			data: {
				failedAt: new Date()
			}
		});
	}
}
