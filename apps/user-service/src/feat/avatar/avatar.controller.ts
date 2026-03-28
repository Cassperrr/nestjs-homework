import { createGrpcController } from '@libs/grpc';
import { AVATAR_SERVICE_NAME } from 'contracts/gen/avatar';

import { AvatarService } from './avatar.service';

export const AvatarController = createGrpcController(
	AVATAR_SERVICE_NAME,
	AvatarService
);
