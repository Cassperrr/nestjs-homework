import { createGrpcController } from '@libs/grpc';
import { BALANCE_SERVICE_NAME } from 'contracts/gen/balance';

import { BalanceService } from './balance.service';

export const BalanceController = createGrpcController(
	BALANCE_SERVICE_NAME,
	BalanceService
);

// @Controller()
// export class BalanceController {
// 	constructor(private readonly balanceService: BalanceService) {}

// 	@GrpcMethod(BALANCE_SERVICE_NAME)
// 	public async getMyBalance(
// 		data: GetMyBalanceRequest
// 	): Promise<GetMyBalanceResponse> {
// 		return this.balanceService.getMyBalance(data);
// 	}

// 	@GrpcMethod(BALANCE_SERVICE_NAME)
// 	public async auditBalance(
// 		data: AuditBalanceRequest
// 	): Promise<AuditBalanceResponse> {
// 		return this.balanceService.auditBalance(data);
// 	}

// 	@GrpcMethod(BALANCE_SERVICE_NAME)
// 	public async depositAmount(
// 		data: DepositAmountRequest
// 	): Promise<DepositAmountResponse> {
// 		return this.balanceService.depositAmount(data);
// 	}

// 	@GrpcMethod(BALANCE_SERVICE_NAME)
// 	public async withdrawalAmount(
// 		data: WithdrawalAmountRequest
// 	): Promise<WithdrawalAmountResponse> {
// 		return this.balanceService.withdrawalAmount(data);
// 	}

// 	@GrpcMethod(BALANCE_SERVICE_NAME)
// 	public async transferAmount(
// 		data: TransferAmountRequest
// 	): Promise<TransferAmountResponse> {
// 		return this.balanceService.transferAmount(data);
// 	}

// 	@GrpcMethod(BALANCE_SERVICE_NAME)
// 	public async putResetBalanceJob(
// 		data: BalanceResetJobRequest
// 	): Promise<StringMessage> {
// 		return { message: '' };
// 	}

// 	@GrpcMethod(BALANCE_SERVICE_NAME)
// 	public async startResetBalanceJob(
// 		data: BalanceResetJobRequest
// 	): Promise<StringMessage> {
// 		return { message: '' };
// 	}

// 	@GrpcMethod(BALANCE_SERVICE_NAME)
// 	public async stopResetBalanceJob(
// 		data: BalanceResetJobRequest
// 	): Promise<StringMessage> {
// 		return { message: '' };
// 	}
// }
