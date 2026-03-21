import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { AccessTokenResponse, OtpCodeResponse } from '../dto';

export const ApiRegister = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Регистрация аккаунта'
		}),
		ApiOkResponse({ type: OtpCodeResponse })
	);

export const ApiResend = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Отправить OTP код заново'
		}),
		ApiOkResponse({ type: OtpCodeResponse })
	);

export const ApiVerify = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Верификация аккаунта'
		}),
		ApiOkResponse({ type: AccessTokenResponse })
	);

export const ApiLogin = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Вход в аккаунт для верифицированного пользователя'
		}),
		ApiOkResponse({ type: AccessTokenResponse })
	);

export const ApiRefresh = () =>
	applyDecorators(
		ApiOperation({
			summary:
				'Генерирует новый токен доступа для верифицированного пользователя'
		}),
		ApiOkResponse({ type: AccessTokenResponse })
	);

export const ApiLogout = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Выход из системы'
		})
	);
