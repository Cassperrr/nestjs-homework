import {
	Controller,
	Delete,
	Headers,
	HttpCode,
	HttpStatus,
	Post,
	Query
} from '@nestjs/common';
import type { AvatarResponse } from 'contracts/gen/avatar';
import { X_ACCOUNT_ID } from 'shared';

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
		@Headers(X_ACCOUNT_ID) accountId: string,
		@UploadedAvatar({ pipe: false }) avatar: Express.Multer.File
	): Promise<AvatarResponse> {
		return this.fileService.saveAvatarPath(accountId, avatar);
	}

	@Delete('avatar/:fileName')
	@HttpCode(HttpStatus.OK)
	public deleteAvatar(
		@Headers(X_ACCOUNT_ID) accountId: string,
		@Query() query: { fileName: string }
	) {
		return this.fileService.deleteAvatarPath(accountId, query.fileName);
	}
}
