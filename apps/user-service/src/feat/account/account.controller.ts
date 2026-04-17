import { ACCESS_LIST } from '@user-service/src/config';
import { ACCOUNT_SERVICE_NAME } from 'contracts/grpc/gen/account';
import { createGrpcController } from 'libs/grpc';

import { AccountService } from './account.service';

export const AccountController = createGrpcController(
	ACCOUNT_SERVICE_NAME,
	AccountService,
	[],
	{
		changePassword: [ACCESS_LIST.gateway],
		confirmPassword: [ACCESS_LIST.gateway],
		delete: [ACCESS_LIST.gateway]
	}
);
