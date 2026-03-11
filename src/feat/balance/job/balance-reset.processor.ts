import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { BalanceRepository, JOBS, QUEUES } from 'src/core';

// === КАК ВЫПОНИТЬ ЗАДАЧУ ===
@Processor(QUEUES.BALANCE_RESET)
export class BalanceResetProcessor extends WorkerHost {
	private readonly logger = new Logger(BalanceResetProcessor.name);

	public constructor(private readonly balanceRepo: BalanceRepository) {
		super();
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

		const resetsCount = await this.balanceRepo.resetAllBalances();

		this.logger.log(
			`Job #${job.id} выполнен. Балансов сброшено ${resetsCount}`
		);
	}
}
