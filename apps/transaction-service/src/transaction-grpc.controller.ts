import { TRANSACTION_SERVICE_NAME } from 'contracts/grpc/gen/transaction';
import { createGrpcController } from 'libsV2/grpc';

import { ACCESS_LIST } from './config';
import { TransactionGrpcService } from './providers/grpc';

export const TransactionGrpcController = createGrpcController(
	TRANSACTION_SERVICE_NAME,
	TransactionGrpcService,
	[],
	{
		depositRub: [ACCESS_LIST.gateway],
		transferRub: [ACCESS_LIST.gateway]
	}
);
