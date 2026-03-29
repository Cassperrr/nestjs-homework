import { createGrpcController } from '@libs/grpc';
import { BALANCE_SERVICE_NAME } from 'contracts/gen/balance';

import { BalanceService } from './balance.service';

const GATEWAY_ACCESS_TOKEN = process.env.GATEWAY_ACCESS_TOKEN as string;
const JOB_ACCESS_TOKEN = process.env.JOB_ACCESS_TOKEN as string;

export const BalanceController = createGrpcController(
	BALANCE_SERVICE_NAME,
	BalanceService,
	[],
	{
		auditBalance: [GATEWAY_ACCESS_TOKEN],
		getMyBalance: [GATEWAY_ACCESS_TOKEN],
		depositAmount: [GATEWAY_ACCESS_TOKEN],
		withdrawalAmount: [GATEWAY_ACCESS_TOKEN],
		transferAmount: [GATEWAY_ACCESS_TOKEN],
		putResetBalanceJob: [GATEWAY_ACCESS_TOKEN],
		startResetBalanceJob: [GATEWAY_ACCESS_TOKEN],
		stopResetBalanceJob: [GATEWAY_ACCESS_TOKEN],
		resetAllBalances: [JOB_ACCESS_TOKEN]
	}
);
