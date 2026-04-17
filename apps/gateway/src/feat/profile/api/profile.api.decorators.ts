import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { ProfileResponse } from '../dto';

export const ApiProfileCreate = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Создать профиль пользователя'
		}),
		ApiOkResponse({ type: ProfileResponse }),
		ApiBearerAuth()
	);

export const ApiProfileUpdate = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Обновить данные профиля пользователя'
		}),
		ApiOkResponse({ type: ProfileResponse }),
		ApiBearerAuth()
	);
