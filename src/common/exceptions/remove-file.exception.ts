import { BadRequestException } from '@nestjs/common';

export class RemoveFileException extends BadRequestException {
	constructor(message?: string) {
		super(`${message || 'Удаление файла не удалось'}`);
	}
}
