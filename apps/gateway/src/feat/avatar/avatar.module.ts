import { Module } from '@nestjs/common';

import { AvatarController } from './avatar.controller';

@Module({
	controllers: [AvatarController],
	providers: []
})
export class AvatarModule {}
