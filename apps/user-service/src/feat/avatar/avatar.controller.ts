import { createGrpcController } from '@libs/grpc';
import { AVATAR_SERVICE_NAME } from 'contracts/gen/avatar';

import { AvatarService } from './avatar.service';

const FILE_ACCESS_TOKEN = process.env.FILE_ACCESS_TOKEN as string;

export const AvatarController = createGrpcController(
	AVATAR_SERVICE_NAME,
	AvatarService,
	[],
	{
		createAvatar: [FILE_ACCESS_TOKEN],
		deleteAvatar: [FILE_ACCESS_TOKEN]
	}
);
