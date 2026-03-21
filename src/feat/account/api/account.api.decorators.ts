import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { OtpCodeResponse } from 'src/feat/auth/dto';

export const ApiPasswordChange = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Иницииализация смены пароля пользователя'
		}),
		ApiOkResponse({ type: OtpCodeResponse }),
		ApiBearerAuth()
	);

export const ApiPasswordConfirm = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Подтверждение смены пароля пользователя'
		}),
		ApiBearerAuth()
	);

export const ApiDeleteAccount = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Удалить аккаунта пользователя'
		}),
		ApiBearerAuth()
	);
