import { createGrpcController } from '@libs/grpc';
import { ACCESS_LIST } from '@user-service/src/config';
import { USERS_SERVICE_NAME } from 'contracts/gen/users';

import { UsersService } from './users.service';

export const UsersController = createGrpcController(
	USERS_SERVICE_NAME,
	UsersService,
	[],
	{
		findMe: [ACCESS_LIST.gateway],
		findAll: [ACCESS_LIST.gateway],
		findActive: [ACCESS_LIST.gateway]
	}
);
