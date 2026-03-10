import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Put
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AccountId, Protected } from 'src/common';

import {
	CreateProfileRequest,
	ProfileResponse,
	UpdateProfileRequest
} from './dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@ApiOperation({
		summary: 'Создать профиль пользователя'
	})
	@ApiOkResponse({ type: ProfileResponse })
	@ApiBearerAuth()
	@Protected()
	@Post()
	@HttpCode(HttpStatus.CREATED)
	public create(@AccountId() id: string, @Body() dto: CreateProfileRequest) {
		return this.profileService.create(id, dto);
	}

	@ApiOperation({
		summary: 'Обновить данные профиля пользователя'
	})
	@ApiOkResponse({ type: ProfileResponse })
	@ApiBearerAuth()
	@Protected()
	@Put()
	@HttpCode(HttpStatus.OK)
	public update(@AccountId() id: string, @Body() dto: UpdateProfileRequest) {
		return this.profileService.update(id, dto);
	}
}
