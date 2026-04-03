import { createGrpcController } from '@libs/grpc';
import { ACCESS_LIST } from '@user-service/src/config';
import { AUTH_SERVICE_NAME } from 'contracts/gen/auth';

import { AuthService } from './auth.service';

export const AuthController = createGrpcController(
	AUTH_SERVICE_NAME,
	AuthService,
	[],
	{
		register: [ACCESS_LIST.gateway],
		resend: [ACCESS_LIST.gateway],
		verify: [ACCESS_LIST.gateway],
		login: [ACCESS_LIST.gateway],
		refresh: [ACCESS_LIST.gateway],
		logout: [ACCESS_LIST.gateway]
	}
);
