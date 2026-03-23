import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Put
} from '@nestjs/common';
import { AccountId, Protected } from 'src/common';

import { ApiProfileCreate, ApiProfileUpdate } from './api';
import { CreateProfileRequest, UpdateProfileRequest } from './dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@ApiProfileCreate()
	@Protected()
	@Post()
	@HttpCode(HttpStatus.CREATED)
	public create(@AccountId() id: string, @Body() dto: CreateProfileRequest) {
		return this.profileService.create(id, dto);
	}

	@ApiProfileUpdate()
	@Protected()
	@Put()
	@HttpCode(HttpStatus.OK)
	public update(@AccountId() id: string, @Body() dto: UpdateProfileRequest) {
		return this.profileService.update(id, dto);
	}
}
