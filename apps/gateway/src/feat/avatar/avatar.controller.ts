import { AccountId, FileProtected, Protected } from '@gateway/src/common';
import { FILE_SIZE_MB } from '@gateway/src/core/constants';
import { FileClientProxy } from '@gateway/src/infra';
import {
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Post,
	Query,
	Req,
	Res
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { ApiDeleteFile, ApiUploadFileStream } from './api';
import { DeleteAvatarRequest } from './dto';

@Controller('avatar')
export class AvatarController {
	public constructor(private readonly fileClient: FileClientProxy) {}

	@ApiUploadFileStream()
	@Protected()
	@FileProtected(FILE_SIZE_MB.AVATAR)
	@Post('stream')
	@HttpCode(HttpStatus.CREATED)
	public uploadAvatarStream(
		@Req() req: Request,
		@Res() res: Response,
		@AccountId() _accountId: string
	) {
		return this.fileClient.proxyToService(req, res);
	}

	@ApiDeleteFile()
	@Protected()
	@Delete(':fileName')
	@HttpCode(HttpStatus.OK)
	public deleteAvatar(
		@Req() req: Request,
		@Res() res: Response,
		@AccountId() _accountId: string,
		@Query() _dto: DeleteAvatarRequest
	): any {
		return this.fileClient.proxyToService(req, res);
	}
}
