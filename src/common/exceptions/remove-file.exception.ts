import { BadRequestException } from '@nestjs/common';

export class RemoveFileException extends BadRequestException {
	constructor(message?: string) {
		super(`${message || 'Something went wrong'}`);
	}
}
