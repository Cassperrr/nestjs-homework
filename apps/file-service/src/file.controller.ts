import { X_ACCOUNT_ID, X_GATEWAY_ACCESS_TOKEN } from '@contracts';
import {
	Controller,
	Delete,
	Headers,
	HttpCode,
	HttpStatus,
	Post,
	Query
} from '@nestjs/common';
import type { AvatarResponse } from 'contracts/grpc/gen/avatar';
import { CheckHeaders } from 'libs/proxy';

import { FileUploadInterceptor } from './common';
import { UploadedAvatar } from './common/decorators';
import { FileService } from './file.service';
import { S3StreamStorage } from './infra';

@Controller()
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@CheckHeaders(X_ACCOUNT_ID, X_GATEWAY_ACCESS_TOKEN)
	@Post('avatar/stream')
	@FileUploadInterceptor('avatar', new S3StreamStorage('avatars'))
	@HttpCode(HttpStatus.CREATED)
	public uploadAvatarStream(
		@Headers(X_ACCOUNT_ID) accountId: string,
		@UploadedAvatar({ pipe: false }) avatar: Express.Multer.File
	): Promise<AvatarResponse> {
		return this.fileService.saveAvatarPath(accountId, avatar);
	}

	@CheckHeaders(X_ACCOUNT_ID, X_GATEWAY_ACCESS_TOKEN)
	@Delete('avatar/:fileName')
	@HttpCode(HttpStatus.OK)
	public deleteAvatar(
		@Headers(X_ACCOUNT_ID) accountId: string,
		@Query() query: { fileName: string }
	) {
		return this.fileService.deleteAvatarPath(accountId, query.fileName);
	}
}
