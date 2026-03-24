import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthClientGrpc } from './auth.grpc';

@Module({
	controllers: [AuthController],
	providers: [AuthClientGrpc],
	exports: [AuthClientGrpc]
})
export class AuthModule {}
