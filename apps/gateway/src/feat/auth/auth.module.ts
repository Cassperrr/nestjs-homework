import { Module } from '@nestjs/common';
import { GrpcModule } from 'libs/grpc';

import { UserController } from './auth.controller';
import { AuthClientGrpc } from './auth.grpc';

@Module({
	imports: [GrpcModule.register(['AUTH_PACKAGE'])],
	controllers: [UserController],
	providers: [AuthClientGrpc],
	exports: [AuthClientGrpc]
})
export class AuthModule {}
