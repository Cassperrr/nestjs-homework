import { createGrpcController } from '@libs/grpc';
import { AUTH_SERVICE_NAME } from 'contracts/gen/auth';

import { AuthService } from './auth.service';

const GATEWAY_ACCESS_TOKEN = process.env.GATEWAY_ACCESS_TOKEN as string;

export const AuthController = createGrpcController(
	AUTH_SERVICE_NAME,
	AuthService,
	[],
	{
		register: [GATEWAY_ACCESS_TOKEN],
		resend: [GATEWAY_ACCESS_TOKEN],
		verify: [GATEWAY_ACCESS_TOKEN],
		login: [GATEWAY_ACCESS_TOKEN],
		refresh: [GATEWAY_ACCESS_TOKEN],
		logout: [GATEWAY_ACCESS_TOKEN]
	}
);
