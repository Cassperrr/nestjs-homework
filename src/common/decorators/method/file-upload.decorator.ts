import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { StorageEngine } from 'multer';

import { FileUploadInterceptor } from '../../interceptors';

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
		FileUploadInterceptor(fieldName, storage)
	);
