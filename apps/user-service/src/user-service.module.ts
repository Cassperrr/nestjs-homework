import { Module } from '@nestjs/common';

import { ConfigModule } from './config';
import { FeatModule } from './feat';
import { InfraModule } from './infra';

@Module({
	imports: [ConfigModule, InfraModule, FeatModule]
})
export class UserServiceModule {}
