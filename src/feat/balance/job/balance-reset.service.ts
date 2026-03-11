import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { QUEUE_EVENTS, QueueService } from 'src/core';

export const BALANCE_RESET_JOB = 'reset-all';

@Injectable()
export class BalanceResetService implements OnApplicationBootstrap {
	private readonly logger = new Logger(BalanceResetService.name);

	public constructor(
		private readonly queueService: QueueService,
		private readonly schedulerRegistry: SchedulerRegistry
	) {}

	public onApplicationBootstrap() {
		const job = this.schedulerRegistry.getCronJob('balancesReset');
		job.stop();
		this.logger.log('Cron остановлен при старте');
	}

	public async enqueueReset() {
		return this.queueService.add(
			QUEUE_EVENTS.BALANCE_RESET,
			BALANCE_RESET_JOB,
			{ triggeredAt: new Date().toISOString() }
		);
	}

	@Cron(CronExpression.EVERY_5_SECONDS, { name: 'balancesReset' })
	public async balancesReset() {
		this.logger.warn('Обнуление баланса пользователей - TRIGGERED');
		await this.queueService.add(
			QUEUE_EVENTS.BALANCE_RESET,
			BALANCE_RESET_JOB,
			{
				triggeredAt: new Date().toISOString()
			}
		);
	}

	public startCron() {
		const job = this.schedulerRegistry.getCronJob('balancesReset');
		job.start();
		this.logger.warn('Обнуление баланса пользователей - STARTED');
	}

	public stopCron() {
		const job = this.schedulerRegistry.getCronJob('balancesReset');
		job.stop();
		this.logger.warn('Обнуление баланса пользователей - STOPPED');
	}
}
