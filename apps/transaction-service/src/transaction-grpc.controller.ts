import { createGrpcController } from '@libs/grpc';
import { TRANSACTION_SERVICE_NAME } from 'contracts/gen/transaction';

import { ACCESS_LIST } from './config';
import { TransactionGrpcService } from './providers/grpc';

export const TransactionGrpcController = createGrpcController(
	TRANSACTION_SERVICE_NAME,
	TransactionGrpcService,
	[],
	{
		depositRub: [ACCESS_LIST.gateway]
	}
);
