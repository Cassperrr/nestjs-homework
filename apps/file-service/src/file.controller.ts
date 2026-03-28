import {
	Controller,
	Headers,
	HttpCode,
	HttpStatus,
	Post
} from '@nestjs/common';

import { FileUploadInterceptor } from './common';
import { UploadedAvatar } from './common/decorators/param';
import { FileService } from './file.service';
import { S3StreamStorage } from './infra';

@Controller()
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post('avatar/stream')
	@FileUploadInterceptor('avatar', new S3StreamStorage('avatars'))
	@HttpCode(HttpStatus.CREATED)
	public uploadAvatarStream(
		@Headers('x-account-id') accountId: string,
		@UploadedAvatar({ pipe: false }) avatar: Express.Multer.File
	) {
		return this.fileService.saveAvatarPath(accountId, avatar);
	}
}
