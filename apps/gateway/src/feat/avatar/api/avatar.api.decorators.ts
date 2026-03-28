import { applyDecorators } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOkResponse,
	ApiOperation
} from '@nestjs/swagger';

import { UploadAvatarResponse } from '../dto';

export const ApiUploadFileBuffer = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Загрузить аватар пользователя (buffer)'
		}),
		ApiOkResponse({ type: UploadAvatarResponse }),
		ApiBearerAuth()
	);

export const ApiUploadFileStream = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Загрузить аватар пользователя (stream)'
		}),
		ApiConsumes('multipart/form-data'),
		ApiBody({
			schema: {
				type: 'object',
				properties: {
					avatar: { type: 'string', format: 'binary' }
				}
			}
		}),
		ApiOkResponse({ type: UploadAvatarResponse }),
		ApiBearerAuth()
	);

export const ApiDeleteFile = () =>
	applyDecorators(
		ApiOperation({
			summary: 'Удалить аватар'
		}),
		ApiBearerAuth()
	);
