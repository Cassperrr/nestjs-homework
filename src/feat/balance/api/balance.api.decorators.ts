import { applyDecorators } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiHeader,
	ApiOkResponse,
	ApiOperation
} from '@nestjs/swagger';

import { BalanceResponse } from '../dto';

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
		// ApiOkResponse({ type: BalanceResponse }),
		ApiBearerAuth()
	);

export const ApiRestore = () =>
	applyDecorators(
		ApiOperation({
			summary:
				'Восстановить консистеность баланса USD пользователя по истории транзакций, только для администратора'
		}),
		// ApiOkResponse({ type: BalanceResponse }),
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
		// ApiOkResponse({ type: BalanceResponse }),
		ApiBearerAuth()
	);

export const ApiWithdrawn = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Вывод USD на другой счет'
		}),
		// ApiOkResponse({ type: BalanceResponse }),
		ApiBearerAuth()
	);

export const ApiTransfer = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Перевести средства с одного аккаунта на другой'
		}),
		// ApiOkResponse({ type: BalanceResponse }),
		ApiBearerAuth()
	);
