import {
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
	@HttpCode(HttpStatus.OK)
	public deposit(
		@IdempotencyKey() idempotencyKey: string,
		@AccountId() id: string,
		dto: any
	) {
		return { idempotencyKey };
	}

	@ApiWithdrawn()
	@Protected()
	@Post('withdrawn')
	@HttpCode(HttpStatus.CREATED)
	public withdrawn(@AccountId() id: string) {
		return { balance: 'заглушка' };
	}

	@ApiTransfer()
	@Protected()
	@Post('transfer')
	@HttpCode(HttpStatus.CREATED)
	public transfer(@AccountId() id: string) {
		return { balance: 'заглушка' };
	}
}
