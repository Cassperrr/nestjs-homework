import { Module } from '@nestjs/common';
import { GrpcClientFactoryModule } from 'libs/grpc';

import { AvatarClientGrpc } from './avatar-client.grpc';

@Module({
	imports: [GrpcClientFactoryModule.registerAsync(['AVATAR'])],
	providers: [AvatarClientGrpc],
	exports: [AvatarClientGrpc]
})
export class GrpcClientsModule {}
