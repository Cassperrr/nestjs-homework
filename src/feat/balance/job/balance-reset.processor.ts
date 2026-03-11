import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_EVENTS } from 'src/core';

import { BALANCE_RESET_JOB } from './balance-reset.service';

@Processor(QUEUE_EVENTS.BALANCE_RESET)
export class BalanceResetProcessor extends WorkerHost {
	private readonly logger = new Logger(BalanceResetProcessor.name);

	public async process(job: Job<{ triggeredAt: string }>) {
		switch (job.name) {
			case BALANCE_RESET_JOB:
				return this.handleResetBalances(job);
			default:
				this.logger.warn(`Неизвестный job: ${job.name}`);
		}
	}

	private async handleResetBalances(job: Job<{ triggeredAt: string }>) {
		this.logger.debug(
			`Job #${job.id}, triggered at: ${job.data.triggeredAt}`
		);

		// await this.usersRepository.updateMany({}, { balance: 0 });

		this.logger.log(`Job #${job.id} выполнен`);
	}
}
