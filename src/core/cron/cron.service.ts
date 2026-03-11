import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class CronService {
	private readonly logger = new Logger(CronService.name);

	public constructor(private readonly schedulerRegistry: SchedulerRegistry) {
		this.logger.debug(`${CronService.name} created`);
	}

	public start(name: string) {
		const job = this.schedulerRegistry.getCronJob(name);
		job.start();
		this.logger.log(`Cron "${name}" запущен`);
	}

	public stop(name: string) {
		const job = this.schedulerRegistry.getCronJob(name);
		job.stop();
		this.logger.log(`Cron "${name}" остановлен`);
	}

	public isRunning(name: string) {
		return this.schedulerRegistry.getCronJob(name).isActive;
	}
}
