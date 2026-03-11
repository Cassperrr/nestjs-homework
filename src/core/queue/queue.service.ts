import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { JobsOptions, Queue } from 'bullmq';

import { QUEUE_EVENTS } from '../constants';

type QueueJobMap = {
	[QUEUE_EVENTS.BALANCE_RESET]: { triggeredAt: string };
};

@Injectable()
export class QueueService {
	private readonly logger = new Logger(QueueService.name);
	private readonly queues: Map<QUEUE_EVENTS, Queue>;

	public constructor(
		@InjectQueue(QUEUE_EVENTS.BALANCE_RESET) balanceResetQueue: Queue
	) {
		this.queues = new Map([
			[QUEUE_EVENTS.BALANCE_RESET, balanceResetQueue]
		]);

		this.logger.debug(`${QueueService.name} created`);
	}

	public async add<Q extends QUEUE_EVENTS>(
		queue: Q,
		jobName: string,
		data: QueueJobMap[Q],
		options?: JobsOptions
	) {
		const q = this.queues.get(queue);
		if (!q) throw new Error(`Queue ${queue} не найдена`);

		const job = await q.add(jobName, data, options);
		this.logger.log(`[${queue}] Job "${jobName}" #${job.id} добавлен`);
		return job;
	}
}
