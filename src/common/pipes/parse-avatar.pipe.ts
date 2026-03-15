import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

export const parseAvatarPipe = new ParseFilePipeBuilder()
	// беру из process и кастую, потому что zod схема уже все провалидировала и как то похуй на кофиг сервис
	.addFileTypeValidator({
		fileType: process.env.AVATAR_ALLOWED_TYPES as string,
		errorMessage: 'Недопустимое расширение файла'
	})
	.addMaxSizeValidator({
		maxSize: Number(process.env.AVATAR_MAX_SIZE_MB) * 1024 * 1024,
		errorMessage: 'Недопустимый размер файла'
	})
	.build({
		errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
	});
