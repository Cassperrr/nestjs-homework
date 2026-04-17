import { ACCESS_LIST } from '@user-service/src/config';
import { BALANCE_SERVICE_NAME } from 'contracts/grpc/gen/balance';
import { createGrpcController } from 'libs/grpc';

import { BalanceService } from './balance.service';

export const BalanceController = createGrpcController(
	BALANCE_SERVICE_NAME,
	BalanceService,
	[],
	{
		getMyBalances: [ACCESS_LIST.gateway],
		validationAccount: [ACCESS_LIST.transaction_service],
		putResetBalanceJob: [ACCESS_LIST.gateway],
		startResetBalanceJob: [ACCESS_LIST.gateway],
		stopResetBalanceJob: [ACCESS_LIST.gateway],
		resetAllBalances: [ACCESS_LIST.job_service]
	}
);
