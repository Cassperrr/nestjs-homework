import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AccountId, FileUpload, Protected, UploadedAvatar } from 'src/common';

import { avatarStreamStorage } from './avatar-stream.storage';
import { AvatarService } from './avatar.service';
import { UploadAvatarResponse } from './dto';

@Controller('avatar')
export class AvatarController {
	constructor(private readonly avatarService: AvatarService) {}

	@ApiOperation({
		summary: 'Загрузить аватар пользователя (buffer)'
	})
	@ApiOkResponse({ type: UploadAvatarResponse })
	@ApiBearerAuth()
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

	@ApiOperation({
		summary: 'Загрузить аватар пользователя (stream)'
	})
	@ApiOkResponse({ type: UploadAvatarResponse })
	@ApiBearerAuth()
	@Protected()
	@Post('stream')
	@FileUpload('avatar', avatarStreamStorage)
	@HttpCode(HttpStatus.CREATED)
	public uploadAvatarStream(
		@AccountId() id: string,
		@UploadedAvatar({ pipe: false }) avatar: Express.Multer.File
	) {
		return this.avatarService.saveAvatarPath(id, avatar.path);
	}
}
