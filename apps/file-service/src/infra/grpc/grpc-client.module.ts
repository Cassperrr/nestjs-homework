import { GrpcClientModule } from '@libs/grpc';
import { Module } from '@nestjs/common';
import { AVATAR_PACKAGE_NAME } from 'contracts/gen/avatar';

import { AvatarClientGrpc } from './avatar-client.grpc';

@Module({
	imports: [GrpcClientModule.register([AVATAR_PACKAGE_NAME])],
	providers: [AvatarClientGrpc],
	exports: [AvatarClientGrpc]
})
export class GrpcModule {}
