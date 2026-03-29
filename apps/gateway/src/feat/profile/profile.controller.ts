import { AccountId, Protected } from '@gateway/src/common';
import { ProfileClientGrpc } from '@gateway/src/infra/grpc';
import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Put
} from '@nestjs/common';

import { ApiProfileCreate, ApiProfileUpdate } from './api';
import {
	CreateProfileRequest,
	ProfileResponse,
	UpdateProfileRequest
} from './dto';

@Controller('profile')
export class ProfileController {
	public constructor(private readonly client: ProfileClientGrpc) {}

	@ApiProfileCreate()
	@Protected()
	@Post()
	@HttpCode(HttpStatus.CREATED)
	public create(
		@AccountId() accountId: string,
		@Body() dto: CreateProfileRequest
	): Promise<ProfileResponse> {
		return this.client.call('createProfile', { accountId, ...dto });
	}

	@ApiProfileUpdate()
	@Protected()
	@Put()
	@HttpCode(HttpStatus.OK)
	public update(
		@AccountId() accountId: string,
		@Body() dto: UpdateProfileRequest
	): Promise<ProfileResponse> {
		return this.client.call('updateProfile', { accountId, ...dto });
	}
}
