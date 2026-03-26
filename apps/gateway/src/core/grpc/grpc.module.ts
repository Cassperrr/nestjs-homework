import { GrpcClientModule } from '@libs/grpc';
import { Module } from '@nestjs/common';
import { ACCOUNT_PACKAGE_NAME } from 'contracts/gen/account';
import { AUTH_PACKAGE_NAME } from 'contracts/gen/auth';
import { AVATAR_PACKAGE_NAME } from 'contracts/gen/avatar';
import { BALANCE_PACKAGE_NAME } from 'contracts/gen/balance';
import { PROFILE_PACKAGE_NAME } from 'contracts/gen/profile';
import { USERS_PACKAGE_NAME } from 'contracts/gen/users';

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
	exports: [GrpcClientModule]
})
export class GrpcModule {}
