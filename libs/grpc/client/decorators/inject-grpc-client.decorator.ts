import { Inject } from '@nestjs/common';

import { GRPC_CLIENT_PREFIX } from '../constants';
import { GRPC_CLIENTS } from '../grpc-client.registry';

export const InjectGrpcClient = (token: keyof typeof GRPC_CLIENTS) =>
	Inject(`${GRPC_CLIENT_PREFIX}_${token}`);
