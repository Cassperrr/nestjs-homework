import { CronService, JOBS, QUEUES, QueueService } from '@job-service/src/core';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { CronJob } from 'cron';

// === КОГДА ЗАПУСКАТЬ ЗАДАЧУ ===
@Injectable()
export class BalanceResetService implements OnModuleInit {
	public constructor(
		private readonly queueService: QueueService,
		private readonly cronService: CronService
	) {}

	public onModuleInit() {
		const job = new CronJob(CronExpression.EVERY_5_SECONDS, async () => {
			await this.enqueue();
		});
		this.cronService.add(JOBS.BALANCE_RESET_ALL, job);
	}

	public async enqueue() {
		return this.queueService.add(
			QUEUES.BALANCE_RESET,
			JOBS.BALANCE_RESET_ALL,
			{ triggeredAt: new Date().toISOString() }
		);
	}

	public startCron() {
		return this.cronService.start(JOBS.BALANCE_RESET_ALL);
	}

	public stopCron() {
		return this.cronService.stop(JOBS.BALANCE_RESET_ALL);
	}
}
