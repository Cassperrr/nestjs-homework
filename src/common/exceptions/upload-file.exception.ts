import { BadRequestException } from '@nestjs/common';

export class UploadFileException extends BadRequestException {
	constructor(message?: string) {
		super(`${message || 'Загрузка файла не удалась'}`);
	}
}
