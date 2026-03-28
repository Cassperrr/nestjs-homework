import { AccountId, FileProtected, Protected } from '@gateway/src/common';
import { FILE_SIZE_MB } from '@gateway/src/core/constants';
import { FileServiceProxyClient } from '@gateway/src/infra';
import {
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { ApiUploadFileStream } from './api';

@Controller('avatar')
export class AvatarController {
	public constructor(
		private readonly fileServiceClient: FileServiceProxyClient
	) {}

	@ApiUploadFileStream()
	@Protected()
	@FileProtected(FILE_SIZE_MB.AVATAR)
	@Post('stream')
	@HttpCode(HttpStatus.CREATED)
	public uploadAvatarStream(
		@Req() req: Request,
		@Res() res: Response,
		@AccountId() accountId: string
	) {
		return this.fileServiceClient.proxyToService(req, res);
	}

	// @ApiDeleteFile()
	// @Protected()
	// @Delete(':fileName')
	// @HttpCode(HttpStatus.OK)
	// public deleteAvatar(
	// 	@AccountId() id: string,
	// 	@Query() dto: DeleteAvatarRequest
	// ): any {
	// 	return this.avatarService.deleteAvatar(id, dto);
	// }
}
