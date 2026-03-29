import { AccountId, IdempotencyKey, Protected } from '@gateway/src/common';
import { BalanceClientGrpc } from '@gateway/src/infra/grpc';
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query
} from '@nestjs/common';
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
	BalanceResponse,
	DepositAmountRequest,
	DepositAmountResponse,
	TransferAmountRequest,
	TransferAmountResponse,
	WithdrawalAmountRequest,
	WithdrawalAmountResponse
} from './dto';

@Controller('balance')
export class BalanceController {
	public constructor(private readonly client: BalanceClientGrpc) {}

	@ApiGetBalance()
	@Protected()
	@Get('my')
	@HttpCode(HttpStatus.OK)
	public getMyBalance(
		@AccountId() accountId: string
	): Promise<BalanceResponse> {
		return this.client.call('getMyBalance', { accountId });
	}

	@ApiAudit()
	@Protected()
	@Get('audit')
	@HttpCode(HttpStatus.OK)
	public auditBalance(
		@AccountId() accountId: string,
		@Query() dto: AuditBalanceRequest
	): Promise<AuditBalanceResponse> {
		return this.client.call('auditBalance', { accountId, ...dto });
	}

	@ApiDeposit()
	@Protected()
	@Post('deposit')
	@HttpCode(HttpStatus.CREATED)
	public deposit(
		@AccountId() accountId: string,
		@IdempotencyKey() idempotencyKey: string,
		@Body() dto: DepositAmountRequest
	): Promise<DepositAmountResponse> {
		return this.client.call('depositAmount', {
			accountId,
			idempotencyKey,
			amount: dto.amountInCents
		});
	}

	@ApiWithdrawn()
	@Protected()
	@Post('withdrawn')
	@HttpCode(HttpStatus.CREATED)
	public withdrawn(
		@AccountId() accountId: string,
		@IdempotencyKey() idempotencyKey: string,
		@Body() dto: WithdrawalAmountRequest
	): Promise<WithdrawalAmountResponse> {
		return this.client.call('withdrawalAmount', {
			accountId,
			idempotencyKey,
			amount: dto.amountInCents,
			withdrawalAccount: dto.withdrawalAccount
		});
	}

	@ApiTransfer()
	@Protected()
	@Post('transfer')
	@HttpCode(HttpStatus.CREATED)
	public transfer(
		@AccountId() accountId: string,
		@IdempotencyKey() idempotencyKey: string,
		@Body() dto: TransferAmountRequest
	): Promise<TransferAmountResponse> {
		return this.client.call('transferAmount', {
			accountId,
			idempotencyKey,
			amount: dto.amountInCents,
			toAccountId: dto.toAccountId
		});
	}

	@ApiReset()
	@Protected()
	@Post('put-reset-job')
	@HttpCode(HttpStatus.ACCEPTED)
	public async putResetBalanceJob(@AccountId() accountId: string) {
		return this.client.call('putResetBalanceJob', { accountId });
	}

	@ApiStartCron()
	@Protected()
	@Post('start-reset-job')
	@HttpCode(HttpStatus.ACCEPTED)
	public startResetBalanceJob(@AccountId() accountId: string) {
		return this.client.call('startResetBalanceJob', { accountId });
	}

	@ApiStopCron()
	@Protected()
	@Post('stop-reset-job')
	@HttpCode(HttpStatus.ACCEPTED)
	public stopResetBalanceJob(@AccountId() accountId: string) {
		return this.client.call('stopResetBalanceJob', { accountId });
	}
}
