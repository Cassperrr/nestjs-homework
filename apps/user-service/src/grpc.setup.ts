import { PROTO_PATHS } from '@contracts';
import { createGrpcServer } from '@libs/grpc';
import { INestApplication } from '@nestjs/common';
import { ACCOUNT_PACKAGE_NAME } from 'contracts/gen/account';
import { AUTH_PACKAGE_NAME } from 'contracts/gen/auth';
import { AVATAR_PACKAGE_NAME } from 'contracts/gen/avatar';
import { BALANCE_PACKAGE_NAME } from 'contracts/gen/balance';
import { PROFILE_PACKAGE_NAME } from 'contracts/gen/profile';
import { USERS_PACKAGE_NAME } from 'contracts/gen/users';

export const grpcSetup = (app: INestApplication, grpcUrl: string) => {
	createGrpcServer(
		app,
		grpcUrl,
		[
			AUTH_PACKAGE_NAME,
			ACCOUNT_PACKAGE_NAME,
			PROFILE_PACKAGE_NAME,
			AVATAR_PACKAGE_NAME,
			USERS_PACKAGE_NAME,
			BALANCE_PACKAGE_NAME
		],
		[
			PROTO_PATHS.AUTH,
			PROTO_PATHS.ACCOUNT,
			PROTO_PATHS.PROFILE,
			PROTO_PATHS.AVATAR,
			PROTO_PATHS.USERS,
			PROTO_PATHS.BALANCE
		]
	);
};
