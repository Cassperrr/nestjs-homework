import { Inject } from '@nestjs/common';

import { RMQ_CLIENT_PREFIX } from '../constants';
import { RMQ_CLIENTS } from '../rmq-client.registry';

export const InjectRmqClient = (token: keyof typeof RMQ_CLIENTS) =>
	Inject(`${RMQ_CLIENT_PREFIX}_${token}`);
