import { Inject } from '@nestjs/common';
import { RMQ_QUEUES } from 'registries';

import { createQueueToken } from '../utils';

export const InjectRmqQueue = (token: keyof typeof RMQ_QUEUES) =>
	Inject(createQueueToken(token));
