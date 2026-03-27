import { Module } from '@nestjs/common';

import { UsersClientGrpc } from './users-client.grpc';
import { UsersController } from './users.controller';

@Module({
	controllers: [UsersController],
	providers: [UsersClientGrpc],
	exports: [UsersClientGrpc]
})
export class UsersModule {}
