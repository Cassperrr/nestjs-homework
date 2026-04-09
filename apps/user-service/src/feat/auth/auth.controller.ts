import { ACCESS_LIST } from '@user-service/src/config';
import { AUTH_SERVICE_NAME } from 'contracts/grpc/gen/auth';
import { createGrpcController } from 'libsV2/grpc';

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
