import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AccountId, FileUpload, Protected, UploadedAvatar } from 'src/common';

import { AvatarService } from './avatar.service';
import { UploadAvatarResponse } from './dto';

@Controller('avatar')
export class AvatarController {
	constructor(private readonly avatarService: AvatarService) {}

	@ApiOperation({
		summary: 'Загрузить аватар пользователя'
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
}
