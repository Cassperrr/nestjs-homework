import { createGrpcController } from '@libs/grpc';
import { PROFILE_SERVICE_NAME } from 'contracts/gen/profile';

import { ProfileService } from './profile.service';

const GATEWAY_ACCESS_TOKEN = process.env.GATEWAY_ACCESS_TOKEN as string;

export const ProfileController = createGrpcController(
	PROFILE_SERVICE_NAME,
	ProfileService,
	[],
	{
		createProfile: [GATEWAY_ACCESS_TOKEN],
		updateProfile: [GATEWAY_ACCESS_TOKEN]
	}
);
