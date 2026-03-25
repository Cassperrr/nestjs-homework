import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersClientGrpc } from './users.grpc';

@Module({
	controllers: [UsersController],
	providers: [UsersClientGrpc],
	exports: [UsersClientGrpc]
})
export class UsersModule {}
