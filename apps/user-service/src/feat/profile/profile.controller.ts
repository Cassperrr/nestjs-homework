import { createGrpcController } from '@libs/grpc';
import { PROFILE_SERVICE_NAME } from 'contracts/gen/profile';

import { ProfileService } from './profile.service';

export const ProfileController = createGrpcController(
	PROFILE_SERVICE_NAME,
	ProfileService
);

// @Controller()
// export class ProfileController {
// 	constructor(private readonly profileService: ProfileService) {}

// 	@GrpcMethod(PROFILE_SERVICE_NAME)
// 	public async createProfile(
// 		data: CreateProfileRequest
// 	): Promise<ProfileResponse> {
// 		return this.profileService.create(data);
// 	}

// 	@GrpcMethod(PROFILE_SERVICE_NAME)
// 	public async updateProfile(
// 		data: UpdateProfileRequest
// 	): Promise<ProfileResponse> {
// 		return this.profileService.update(data);
// 	}
// }
