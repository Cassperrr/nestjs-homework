import { Module } from '@nestjs/common';

import { ConfigModule } from './config';
import { CoreModule } from './core';
import { InfraModule } from './infra';
import { IntegrateModule } from './integrate';
import { ProcessesModule } from './processes';

@Module({
	imports: [
		ConfigModule,
		InfraModule,
		CoreModule,
		IntegrateModule,
		ProcessesModule
	]
})
export class TransactionServiceModule {}
