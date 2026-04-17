import { Module } from '@nestjs/common';

import { ConfigModule } from './config';
import { CoreModule } from './core';
import { FeatModule } from './feat';
import { InfraModule } from './infra';

@Module({
	imports: [ConfigModule, InfraModule, CoreModule, FeatModule]
})
export class UserServiceModule {}
