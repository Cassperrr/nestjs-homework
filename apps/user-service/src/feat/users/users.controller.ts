import { createGrpcController } from '@libs/grpc';
import { USERS_SERVICE_NAME } from 'contracts/gen/users';

import { UsersService } from './users.service';

const GATEWAY_ACCESS_TOKEN = process.env.GATEWAY_ACCESS_TOKEN as string;

export const UsersController = createGrpcController(
	USERS_SERVICE_NAME,
	UsersService,
	[],
	{
		findMe: [GATEWAY_ACCESS_TOKEN],
		findAll: [GATEWAY_ACCESS_TOKEN],
		findActive: [GATEWAY_ACCESS_TOKEN]
	}
);
