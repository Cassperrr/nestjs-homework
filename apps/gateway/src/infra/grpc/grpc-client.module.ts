import { GrpcClientModule } from '@libs/grpc';
import { Module } from '@nestjs/common';
import { ACCOUNT_PACKAGE_NAME } from 'contracts/gen/account';
import { AUTH_PACKAGE_NAME } from 'contracts/gen/auth';
import { BALANCE_PACKAGE_NAME } from 'contracts/gen/balance';
import { PROFILE_PACKAGE_NAME } from 'contracts/gen/profile';
import { USERS_PACKAGE_NAME } from 'contracts/gen/users';

import { AccountClientGrpc } from './account-client.grpc';
import { AuthClientGrpc } from './auth-client.grpc';
import { BalanceClientGrpc } from './balance-client.grpc';
import { ProfileClientGrpc } from './profile-client.grpc';
import { UsersClientGrpc } from './users-client.grpc';

@Module({
	imports: [
		GrpcClientModule.register([
			AUTH_PACKAGE_NAME,
			ACCOUNT_PACKAGE_NAME,
			PROFILE_PACKAGE_NAME,
			USERS_PACKAGE_NAME,
			BALANCE_PACKAGE_NAME
		])
	],
	providers: [
		AuthClientGrpc,
		AccountClientGrpc,
		ProfileClientGrpc,
		UsersClientGrpc,
		BalanceClientGrpc
	],
	exports: [
		AuthClientGrpc,
		AccountClientGrpc,
		ProfileClientGrpc,
		UsersClientGrpc,
		BalanceClientGrpc
	]
})
export class GrpcModule {}
