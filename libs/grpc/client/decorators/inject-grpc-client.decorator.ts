import { Inject } from '@nestjs/common';

import { GRPC_CLIENTS } from '../config';
import { GRPC_CLIENT_PREFIX } from '../constants';

export const InjectGrpcClient = (token: keyof typeof GRPC_CLIENTS) =>
	Inject(`${GRPC_CLIENT_PREFIX}_${token}`);
