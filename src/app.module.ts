import { Module } from '@nestjs/common';

import { AppConfigModule } from './config';
import { CoreModule } from './core';
import { FeatModule } from './feat';
import { InfraModule } from './infra';

@Module({
	imports: [AppConfigModule, CoreModule, InfraModule, FeatModule]
})
export class AppModule {}
