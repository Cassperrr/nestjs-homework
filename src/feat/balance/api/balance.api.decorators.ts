import { applyDecorators } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiHeader,
	ApiOkResponse,
	ApiOperation
} from '@nestjs/swagger';

import {
	AuditBalanceResponse,
	BalanceResponse,
	DepositAmountResponse,
	TransferAmountResponse,
	WithdrawalAmountResponse
} from '../dto';

export const ApiGetBalance = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Показать мой баланс USD'
		}),
		ApiOkResponse({ type: BalanceResponse }),
		ApiBearerAuth()
	);

export const ApiAudit = () =>
	applyDecorators(
		ApiOperation({
			summary:
				'Проверить консистеность баланса USD пользователя по истории транзакций, только для администратора'
		}),
		ApiOkResponse({ type: AuditBalanceResponse }),
		ApiBearerAuth()
	);

export const ApiDeposit = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Пополнить баланс USD'
		}),
		ApiHeader({
			name: 'Idempotency-Key',
			description: 'В swagger генерация автоматическая, V4',
			required: false
		}),
		ApiOkResponse({ type: DepositAmountResponse }),
		ApiBearerAuth()
	);

export const ApiWithdrawn = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Вывод USD на другой счет'
		}),
		ApiHeader({
			name: 'Idempotency-Key',
			description: 'В swagger генерация автоматическая, V4',
			required: false
		}),
		ApiOkResponse({ type: WithdrawalAmountResponse }),
		ApiBearerAuth()
	);

export const ApiTransfer = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Перевести средства с одного аккаунта на другой'
		}),
		ApiOkResponse({ type: TransferAmountResponse }),
		ApiBearerAuth()
	);
