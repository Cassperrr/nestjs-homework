import { createGrpcController } from '@libs/grpc';
import { ACCESS_LIST } from '@user-service/src/config';
import { PROFILE_SERVICE_NAME } from 'contracts/gen/profile';

import { ProfileService } from './profile.service';

export const ProfileController = createGrpcController(
	PROFILE_SERVICE_NAME,
	ProfileService,
	[],
	{
		createProfile: [ACCESS_LIST.gateway],
		updateProfile: [ACCESS_LIST.gateway]
	}
);
