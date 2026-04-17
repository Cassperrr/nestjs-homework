import { RMQ_QUEUES } from 'registries';

export const createQueueToken = (token: keyof typeof RMQ_QUEUES) =>
	`RMQ_QUEUE_${token}`;
