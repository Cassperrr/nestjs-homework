import {
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Post,
	Query
} from '@nestjs/common';
import { AccountId, FileUpload, Protected, UploadedAvatar } from 'src/common';

import { ApiDeleteFile, ApiUploadFileBuffer, ApiUploadFileStream } from './api';
import { avatarStreamStorage } from './avatar-stream.storage';
import { AvatarService } from './avatar.service';
import { DeleteAvatarRequest } from './dto';

@Controller('avatar')
export class AvatarController {
	constructor(private readonly avatarService: AvatarService) {}

	@ApiUploadFileBuffer()
	@Protected()
	@Post()
	@FileUpload('avatar')
	@HttpCode(HttpStatus.CREATED)
	public uploadAvatar(
		@AccountId() id: string,
		@UploadedAvatar() avatar: Express.Multer.File
	) {
		return this.avatarService.uploadAvatar(id, avatar);
	}

	@ApiUploadFileStream()
	@Protected()
	@Post('stream')
	@FileUpload('avatar', avatarStreamStorage)
	@HttpCode(HttpStatus.CREATED)
	public uploadAvatarStream(
		@AccountId() id: string,
		@UploadedAvatar({ pipe: false }) avatar: Express.Multer.File
	) {
		return this.avatarService.saveAvatarPath(id, avatar);
	}

	@ApiDeleteFile()
	@Protected()
	@Delete(':fileName')
	@HttpCode(HttpStatus.OK)
	public deleteAvatar(
		@AccountId() id: string,
		@Query() dto: DeleteAvatarRequest
	) {
		return this.avatarService.deleteAvatar(id, dto);
	}
}
