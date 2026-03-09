import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export const FileUpload = (fieldName = 'file') =>
	applyDecorators(
		ApiConsumes('multipart/form-data'),
		ApiBody({
			schema: {
				type: 'object',
				properties: {
					[fieldName]: { type: 'string', format: 'binary' }
				}
			}
		}),
		UseInterceptors(FileInterceptor(fieldName))
	);
