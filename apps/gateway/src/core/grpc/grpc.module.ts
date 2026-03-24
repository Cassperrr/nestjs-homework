import { GrpcClientModule } from '@libs/grpc';
import { Module } from '@nestjs/common';
import { ACCOUNT_PACKAGE_NAME } from 'contracts/gen/account';
import { AUTH_PACKAGE_NAME } from 'contracts/gen/auth';

@Module({
	imports: [
		GrpcClientModule.register([AUTH_PACKAGE_NAME, ACCOUNT_PACKAGE_NAME])
	],
	exports: [GrpcClientModule]
})
export class GrpcModule {}
