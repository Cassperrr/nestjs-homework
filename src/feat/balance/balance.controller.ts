import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	Post
} from '@nestjs/common';
import { Role } from 'prisma/generated/enums';
import { AccountId, IdempotencyKey, Protected } from 'src/common';

import {
	ApiAudit,
	ApiDeposit,
	ApiGetBalance,
	ApiRestore,
	ApiTransfer,
	ApiWithdrawn
} from './api';
import { BalanceService } from './balance.service';
import {
	DepositAmountRequest,
	TransferAmountRequest,
	WithdrawalAmountRequest
} from './dto';

@Controller('balance')
export class BalanceController {
	constructor(private readonly balanceService: BalanceService) {}

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
	public audit(@AccountId() id: string) {
		return { balance: { cached: 'заглушка', history: 'заглушка' } };
	}

	@ApiRestore()
	@Protected(Role.ADMIN)
	@Patch('restore')
	@HttpCode(HttpStatus.OK)
	public restore(@AccountId() id: string) {
		return { balance: { old: 'заглушка', new: 'заглушка' } };
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
}
