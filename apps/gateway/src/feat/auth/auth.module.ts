import { Module } from '@nestjs/common';

import { AuthClientGrpc } from './auth-client.grpc';
import { AuthController } from './auth.controller';

@Module({
	controllers: [AuthController],
	providers: [AuthClientGrpc],
	exports: [AuthClientGrpc]
})
export class AuthModule {}
