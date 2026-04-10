import { ACCESS_LIST } from '@transaction-service/src/config';
import { TRANSACTION_SERVICE_NAME } from 'contracts/grpc/gen/transaction';
import { createGrpcController } from 'libsV2/grpc';

import { GrpcProcessService } from './grpc-process.service';

export const GrpcProcessController = createGrpcController(
	TRANSACTION_SERVICE_NAME,
	GrpcProcessService,
	[],
	{
		depositRub: [ACCESS_LIST.gateway],
		transferRub: [ACCESS_LIST.gateway]
	}
);
