import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageEngine } from 'multer';

export const FileUploadInterceptor = (
	fieldName: string,
	storage?: StorageEngine
) => UseInterceptors(FileInterceptor(fieldName, storage ? { storage } : {}));
