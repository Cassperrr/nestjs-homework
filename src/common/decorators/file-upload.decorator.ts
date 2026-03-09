import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { StorageEngine } from 'multer';

export const FileUpload = (fieldName = 'file', storage?: StorageEngine) =>
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
		UseInterceptors(FileInterceptor(fieldName, storage ? { storage } : {}))
	);
