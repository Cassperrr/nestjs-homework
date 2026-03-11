import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronService, JOBS, QUEUES, QueueService } from 'src/core';
import { IJobService } from 'src/shared';

// === КОГДА ЗАПУСКАТЬ ЗАДАЧУ ===
@Injectable()
export class BalanceResetService
	implements OnApplicationBootstrap, IJobService
{
	public constructor(
		private readonly queueService: QueueService,
		private readonly cronService: CronService
	) {}

	// останавливает крон при старте приложения
	public onApplicationBootstrap() {
		this.cronService.stop(JOBS.BALANCE_RESET_ALL);
	}

	// кладет в очеред через HTTP (вручную)
	public async enqueue() {
		return this.queueService.add(
			QUEUES.BALANCE_RESET,
			JOBS.BALANCE_RESET_ALL,
			{
				triggeredAt: new Date().toISOString()
			}
		);
	}

	// кладет в очеред автоматически
	@Cron(CronExpression.EVERY_10_MINUTES, { name: JOBS.BALANCE_RESET_ALL })
	public async cronEnequeu() {
		return this.enqueue();
	}

	public startCron() {
		return this.cronService.start(JOBS.BALANCE_RESET_ALL);
	}

	public stopCron() {
		return this.cronService.stop(JOBS.BALANCE_RESET_ALL);
	}
}
