import { Inject } from '@nestjs/common';
import { RMQ_CLIENTS } from 'registries';

import { createClientToken } from '../utils';

export const InjectRmqProducer = (token: keyof typeof RMQ_CLIENTS) =>
	Inject(createClientToken(token));
