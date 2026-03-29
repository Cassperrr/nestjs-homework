import { createGrpcController } from '@libs/grpc';
import { ACCOUNT_SERVICE_NAME } from 'contracts/gen/account';

import { AccountService } from './account.service';

const GATEWAY_ACCESS_TOKEN = process.env.GATEWAY_ACCESS_TOKEN as string;

export const AccountController = createGrpcController(
	ACCOUNT_SERVICE_NAME,
	AccountService,
	[],
	{
		changePassword: [GATEWAY_ACCESS_TOKEN],
		confirmPassword: [GATEWAY_ACCESS_TOKEN],
		delete: [GATEWAY_ACCESS_TOKEN]
	}
);
