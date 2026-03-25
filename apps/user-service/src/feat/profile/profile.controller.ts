import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
	type CreateProfileRequest,
	PROFILE_SERVICE_NAME,
	type ProfileResponse,
	type UpdateProfileRequest
} from 'contracts/gen/profile';

import { ProfileService } from './profile.service';

@Controller()
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@GrpcMethod(PROFILE_SERVICE_NAME)
	public async createProfile(
		data: CreateProfileRequest
	): Promise<ProfileResponse> {
		return this.profileService.create(data);
	}

	@GrpcMethod(PROFILE_SERVICE_NAME)
	public async updateProfile(
		data: UpdateProfileRequest
	): Promise<ProfileResponse> {
		return this.profileService.update(data);
	}
}
