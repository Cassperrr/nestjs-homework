import { createGrpcController } from '@libs/grpc';
import { ACCESS_LIST } from '@user-service/src/config';
import { AVATAR_SERVICE_NAME } from 'contracts/gen/avatar';

import { AvatarService } from './avatar.service';

export const AvatarController = createGrpcController(
	AVATAR_SERVICE_NAME,
	AvatarService,
	[],
	{
		createAvatar: [ACCESS_LIST.file_service],
		deleteAvatar: [ACCESS_LIST.file_service]
	}
);
