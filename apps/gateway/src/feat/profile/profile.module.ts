import { Module } from '@nestjs/common';

import { ProfileController } from './profile.controller';
import { ProfileClientGrpc } from './profile.grpc';

@Module({
	controllers: [ProfileController],
	providers: [ProfileClientGrpc],
	exports: [ProfileClientGrpc]
})
export class ProfileModule {}
