import { Inject } from '@nestjs/common';

import { RMQ_CLIENTS } from '../config';
import { RMQ_CLIENT_PREFIX } from '../constants';

export const InjectRmqClient = (token: keyof typeof RMQ_CLIENTS) =>
	Inject(`${RMQ_CLIENT_PREFIX}_${token}`);
