import { AccountId, IdempotencyKey, Protected } from '@gateway/src/common';
import {
	BalanceClientGrpc,
	TransactionClientGrpc
} from '@gateway/src/infra/grpc';
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query
} from '@nestjs/common';
import type { StringMessage } from 'contracts/gen/shared';
import { Role } from 'shared';

import {
	ApiAudit,
	ApiDeposit,
	ApiGetBalance,
	ApiReset,
	ApiStartCron,
	ApiStopCron,
	ApiTransfer,
	ApiWithdrawn
} from './api';
import {
	AuditBalanceRequest,
	AuditBalanceResponse,
	DepositAmountRequest,
	DepositAmountResponse,
	GetMyBalancesResponse,
	TransferAmountRequest,
	TransferAmountResponse,
	WithdrawalAmountRequest,
	WithdrawalAmountResponse
} from './dto';

@Controller('balance')
export class BalanceController {
	public constructor(
		private readonly balanceClient: BalanceClientGrpc,
		private readonly txClient: TransactionClientGrpc
	) {}

	@ApiGetBalance()
	@Protected()
	@Get('my')
	@HttpCode(HttpStatus.OK)
	public getMyBalance(
		@AccountId() accountId: string
	): Promise<GetMyBalancesResponse> {
		return this.balanceClient.call('getMyBalances', { accountId });
	}

	@ApiDeposit()
	@Protected()
	@Post('deposit/rub')
	@HttpCode(HttpStatus.CREATED)
	public depositRub(
		@AccountId() accountId: string,
		@IdempotencyKey() idempotencyKey: string,
		@Body() dto: DepositAmountRequest
	): Promise<DepositAmountResponse> {
		return this.txClient.call('depositRub', {
			accountId,
			idempotencyKey,
			amount: dto.amountInCents
		});
	}

	@ApiTransfer()
	@Protected()
	@Post('transfer/rub')
	@HttpCode(HttpStatus.CREATED)
	public transferRub(
		@AccountId() accountId: string,
		@IdempotencyKey() idempotencyKey: string,
		@Body() dto: TransferAmountRequest
	): Promise<StringMessage> {
		return this.txClient.call('transferRub', {
			accountId,
			idempotencyKey,
			amount: dto.amountInCents,
			toAccountId: dto.toAccountId
		});
	}

	// @ApiWithdrawn()
	// @Protected()
	// @Post('withdrawn')
	// @HttpCode(HttpStatus.CREATED)
	// public withdrawn(
	// 	@AccountId() accountId: string,
	// 	@IdempotencyKey() idempotencyKey: string,
	// 	@Body() dto: WithdrawalAmountRequest
	// ): Promise<WithdrawalAmountResponse> {
	// 	return this.client.call('withdrawalAmount', {
	// 		accountId,
	// 		idempotencyKey,
	// 		amount: dto.amountInCents,
	// 		withdrawalAccount: dto.withdrawalAccount
	// 	});
	// }

	// @ApiReset()
	// @Protected()
	// @Post('put-reset-job')
	// @HttpCode(HttpStatus.ACCEPTED)
	// public async putResetBalanceJob(@AccountId() accountId: string) {
	// 	return this.client.call('putResetBalanceJob', { accountId });
	// }

	// @ApiStartCron()
	// @Protected()
	// @Post('start-reset-job')
	// @HttpCode(HttpStatus.ACCEPTED)
	// public startResetBalanceJob(@AccountId() accountId: string) {
	// 	return this.client.call('startResetBalanceJob', { accountId });
	// }

	// @ApiStopCron()
	// @Protected()
	// @Post('stop-reset-job')
	// @HttpCode(HttpStatus.ACCEPTED)
	// public stopResetBalanceJob(@AccountId() accountId: string) {
	// 	return this.client.call('stopResetBalanceJob', { accountId });
	// }
}
