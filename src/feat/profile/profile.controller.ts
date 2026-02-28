import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Put
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Authorization, Id } from 'src/common';

import {
	CreateProfileRequest,
	MeResponse,
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
	@Authorization()
	@Post()
	@HttpCode(HttpStatus.CREATED)
	public async create(@Id() id: string, @Body() dto: CreateProfileRequest) {
		return this.profileService.create(id, dto);
	}

	@ApiOperation({
		summary: 'Обновить данные профиля пользователя'
	})
	@ApiOkResponse({ type: ProfileResponse })
	@ApiBearerAuth()
	@Authorization()
	@Put()
	@HttpCode(HttpStatus.OK)
	public async update(@Id() id: string, @Body() dto: UpdateProfileRequest) {
		return this.profileService.update(id, dto);
	}

	@ApiOperation({
		summary: 'Вернуть полный профиль пользователя'
	})
	@ApiOkResponse({ type: MeResponse })
	@ApiBearerAuth()
	@Authorization()
	@Get()
	@HttpCode(HttpStatus.OK)
	public async me(@Id() id: string) {
		return this.profileService.me(id);
	}
}
