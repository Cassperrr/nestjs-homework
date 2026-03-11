import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query
} from '@nestjs/common';
import { Role } from 'prisma/generated/enums';
import { AccountId, IdempotencyKey, Protected } from 'src/common';

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
import { BalanceService } from './balance.service';
import {
	AuditBalanceRequest,
	DepositAmountRequest,
	TransferAmountRequest,
	WithdrawalAmountRequest
} from './dto';
import { BalanceResetService } from './job/balance-reset.service';

@Controller('balance')
export class BalanceController {
	constructor(
		private readonly balanceService: BalanceService,
		private readonly balanceResetService: BalanceResetService
	) {}

	@ApiGetBalance()
	@Protected()
	@Get()
	@HttpCode(HttpStatus.OK)
	public getBalance(@AccountId() id: string) {
		return this.balanceService.findBalance(id);
	}

	@ApiAudit()
	@Protected(Role.ADMIN)
	@Get('audit')
	@HttpCode(HttpStatus.OK)
	public audit(@AccountId() id: string, @Query() dto: AuditBalanceRequest) {
		return this.balanceService.auditBalance(id, dto);
	}

	@ApiDeposit()
	@Protected()
	@Post('deposit')
	@HttpCode(HttpStatus.CREATED)
	public deposit(
		@AccountId() id: string,
		@IdempotencyKey() idempotencyKey: string,
		@Body() dto: DepositAmountRequest
	) {
		return this.balanceService.deposit(id, idempotencyKey, dto);
	}

	@ApiWithdrawn()
	@Protected()
	@Post('withdrawn')
	@HttpCode(HttpStatus.CREATED)
	public withdrawn(
		@AccountId() id: string,
		@IdempotencyKey() idempotencyKey: string,
		@Body() dto: WithdrawalAmountRequest
	) {
		return this.balanceService.withdrawal(id, idempotencyKey, dto);
	}

	@ApiTransfer()
	@Protected()
	@Post('transfer')
	@HttpCode(HttpStatus.CREATED)
	public transfer(
		@AccountId() id: string,
		@IdempotencyKey() idempotencyKey: string,
		@Body() dto: TransferAmountRequest
	) {
		return this.balanceService.transfer(id, idempotencyKey, dto);
	}

	@ApiReset()
	@Protected()
	@Post('reset')
	@HttpCode(HttpStatus.ACCEPTED)
	public async reset(@AccountId() id: string) {
		await this.balanceResetService.enqueueReset();
		return { message: 'Job по обнулению баланса отправлен в очередь' };
	}

	@ApiStartCron()
	@Protected()
	@Post('cron/start')
	@HttpCode(HttpStatus.ACCEPTED)
	public startCron(@AccountId() id: string) {
		this.balanceResetService.startCron();
		return { message: 'Job по обнулению баланса запущен' };
	}

	@ApiStopCron()
	@Protected()
	@Post('cron/stop')
	@HttpCode(HttpStatus.ACCEPTED)
	public stopCron(@AccountId() id: string) {
		this.balanceResetService.stopCron();
		return { message: 'Job по обнулению баланса остановлен' };
	}
}
