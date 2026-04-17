import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { JOBS } from '../constants';

@Injectable()
export class CronService {
	private readonly logger = new Logger(CronService.name);

	public constructor(private readonly schedulerRegistry: SchedulerRegistry) {
		this.logger.debug(`${CronService.name} created`);
	}

	public add(name: JOBS, job: CronJob) {
		this.schedulerRegistry.addCronJob(name, job);
		this.logger.log(`Cron "${name}" создан`);
	}

	public start(name: JOBS) {
		const job = this.schedulerRegistry.getCronJob(name);
		job.start();
		this.logger.log(`Cron "${name}" запущен`);
	}

	public stop(name: JOBS) {
		const job = this.schedulerRegistry.getCronJob(name);
		job.stop();
		this.logger.log(`Cron "${name}" остановлен`);
	}

	public isRunning(name: JOBS) {
		return this.schedulerRegistry.getCronJob(name).isActive;
	}
}
