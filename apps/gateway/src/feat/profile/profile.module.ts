import { Module } from '@nestjs/common';

import { ProfileClientGrpc } from './profile-client.grpc';
import { ProfileController } from './profile.controller';

@Module({
	controllers: [ProfileController],
	providers: [ProfileClientGrpc],
	exports: [ProfileClientGrpc]
})
export class ProfileModule {}
