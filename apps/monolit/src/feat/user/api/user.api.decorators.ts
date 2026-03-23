import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { ActiveUserResponse, FindAllUsersResponse, UserResponse } from '../dto';

export const ApiGetMe = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Получить полный профиль моего пользователя'
		}),
		ApiOkResponse({ type: UserResponse }),
		ApiBearerAuth()
	);

export const ApiGetAll = () =>
	applyDecorators(
		ApiOperation({
			summary:
				'Получить всех пользователей или найти пользователя по username, только для администратора'
		}),
		ApiOkResponse({ type: FindAllUsersResponse }),
		ApiBearerAuth()
	);

export const ApiGetActive = () =>
	applyDecorators(
		ApiOperation({
			summary:
				'Получить всех активных пользователей, только для администратора'
		}),
		ApiOkResponse({ type: ActiveUserResponse, isArray: true }),
		ApiBearerAuth()
	);
