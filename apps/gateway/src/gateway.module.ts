import { Module } from '@nestjs/common';

import { ConfigModule } from './config';
import { CoreModule } from './core';
import { FeatModule } from './feat';

@Module({
	imports: [ConfigModule, CoreModule, FeatModule]
})
export class GatewayModule {}
