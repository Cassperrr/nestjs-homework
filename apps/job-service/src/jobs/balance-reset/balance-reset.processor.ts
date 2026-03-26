import { JobServiceEnv } from '@job-service/src/config';
import { JOBS, QUEUES } from '@job-service/src/core';
import { BalanceClientGrpc } from '@job-service/src/infra/grpc';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';

// === КАК ВЫПОНИТЬ ЗАДАЧУ ===
@Processor(QUEUES.BALANCE_RESET)
export class BalanceResetProcessor extends WorkerHost {
	private readonly logger = new Logger(BalanceResetProcessor.name);
	private readonly USER_JOB_API_TOKEN: string;

	public constructor(
		private readonly balanceClient: BalanceClientGrpc,
		private readonly config: ConfigService<JobServiceEnv, true>
	) {
		super();
		this.USER_JOB_API_TOKEN = config.get('USER_JOB_API_TOKEN', {
			infer: true
		});
	}

	// слушает редис (pub/sub)
	public async process(job: Job<{ triggeredAt: string }>) {
		switch (job.name as JOBS) {
			case JOBS.BALANCE_RESET_ALL:
				return this.handleResetBalances(job);
			default:
				this.logger.warn(`Неизвестный job: ${job.name}`);
		}
	}

	// логика
	private async handleResetBalances(job: Job<{ triggeredAt: string }>) {
		this.logger.debug(
			`Job #${job.id}, triggered at: ${job.data.triggeredAt}`
		);

		const data = await this.balanceClient.call('resetAllBalances', {
			apiToken: this.USER_JOB_API_TOKEN
		});

		this.logger.log(
			`Job #${job.id} выполнен. Балансов сброшено ${data.resetCounts}`
		);
	}
}
