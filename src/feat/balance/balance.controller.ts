import {
	Controller,
	Get,
	Headers,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	Req
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiHeader,
	ApiOkResponse,
	ApiOperation
} from '@nestjs/swagger';
import { Role } from 'prisma/generated/enums';
import { AccountId, IdempotencyKey, Protected } from 'src/common';

import { BalanceService } from './balance.service';
import { BalanceResponse } from './dto';

@Controller('balance')
export class BalanceController {
	constructor(private readonly balanceService: BalanceService) {}

	@ApiOperation({
		summary: 'Показать мой баланс USD'
	})
	@ApiBearerAuth()
	@ApiOkResponse({ type: BalanceResponse })
	@Protected()
	@Get()
	@HttpCode(HttpStatus.OK)
	public getBalance(@AccountId() id: string) {
		return this.balanceService.findBalance(id);
	}

	@ApiOperation({
		summary:
			'Проверить консистеность баланса USD пользователя по истории транзакций, только для администратора'
	})
	@ApiBearerAuth()
	// @ApiOkResponse({ type: OtpCodeResponse })
	@Protected(Role.ADMIN)
	@Get('audit')
	@HttpCode(HttpStatus.OK)
	public audit(@AccountId() id: string) {
		return { balance: { cached: 'заглушка', history: 'заглушка' } };
	}

	@ApiOperation({
		summary:
			'Восстановить консистеность баланса USD пользователя по истории транзакций, только для администратора'
	})
	@ApiBearerAuth()
	// @ApiOkResponse({ type: OtpCodeResponse })
	@Protected(Role.ADMIN)
	@Patch('restore')
	@HttpCode(HttpStatus.OK)
	public restore(@AccountId() id: string) {
		return { balance: { old: 'заглушка', new: 'заглушка' } };
	}

	@ApiOperation({
		summary: 'Пополнить баланс USD'
	})
	@ApiHeader({
		name: 'Idempotency-Key',
		description: 'В swagger генерация автоматическая, V4',
		required: false
	})
	@ApiBearerAuth()
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

	@ApiOperation({
		summary: 'Вывод USD на другой счет'
	})
	@ApiBearerAuth()
	// @ApiOkResponse({ type: OtpCodeResponse })
	@Protected()
	@Post('withdrawn')
	@HttpCode(HttpStatus.CREATED)
	public withdrawn(@AccountId() id: string) {
		return { balance: 'заглушка' };
	}

	@ApiOperation({
		summary: 'Перевести средства с одного аккаунта на другой'
	})
	@ApiBearerAuth()
	// @ApiOkResponse({ type: OtpCodeResponse })
	@Protected()
	@Post('transfer')
	@HttpCode(HttpStatus.CREATED)
	public transfer(@AccountId() id: string) {
		return { balance: 'заглушка' };
	}
}
