import { createGrpcController } from '@libs/grpc';
import { ACCESS_LIST } from '@user-service/src/config';
import { BALANCE_SERVICE_NAME } from 'contracts/gen/balance';

import { BalanceService } from './balance.service';

const JOB_ACCESS_TOKEN = process.env.JOB_ACCESS_TOKEN as string;

export const BalanceController = createGrpcController(
	BALANCE_SERVICE_NAME,
	BalanceService,
	[],
	{
		getMyBalances: [ACCESS_LIST.gateway],
		validationAccount: [ACCESS_LIST.transaction_service]
	}
);
