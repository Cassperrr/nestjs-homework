import { Inject } from '@nestjs/common';

import { GRPC_CLIENTS } from '../config';
import { createClientToken } from '../utils';

export const InjectGrpcClient = (token: keyof typeof GRPC_CLIENTS) =>
	Inject(createClientToken(token));
