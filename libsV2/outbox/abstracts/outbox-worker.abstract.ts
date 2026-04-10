import {
	Logger,
	type OnModuleDestroy,
	type OnModuleInit
} from '@nestjs/common';
import { CronJob } from 'cron';

import { OutboxEvent } from './interfaces';

export abstract class AbstractOutboxWorkerService
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(this.constructor.name);
	private cronJob!: CronJob;
	private isProcessing = false;

	public constructor(private readonly CRON_EXPRESSION: string) {}

	protected abstract findEvents(): Promise<OutboxEvent[]>;
	protected abstract publishEvent(event: OutboxEvent): Promise<void>;
	protected abstract markEventsAsProcessed(ids: string[]): Promise<void>;

	public onModuleInit() {
		this.cronJob = new CronJob(
			this.CRON_EXPRESSION,
			() => this.processOutbox(),
			null,
			true,
			'UTC'
		);
	}

	public onModuleDestroy() {
		void this.cronJob.stop();
	}

	private async processOutbox() {
		if (this.isProcessing) return;
		this.isProcessing = true;

		try {
			const events = await this.findEvents();
			if (events.length === 0) return;

			this.logger.log(`Processing ${events.length} outbox events`);

			const processedIds: string[] = [];

			for (const event of events) {
				try {
					await this.publishEvent(event);
					processedIds.push(event.id);
				} catch (error) {
					this.logger.warn(`Event ${event.id} failed`, error);
				}
			}

			if (processedIds.length === 0) return;

			await this.markEventsAsProcessed(processedIds);
		} catch (err) {
			this.logger.error('Outbox cron error', err);
		} finally {
			this.isProcessing = false;
		}
	}
}
