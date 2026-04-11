import { Module } from '@nestjs/common';

import { ConfigModule } from './config';
import { CoreModule } from './core';
import { InfraModule } from './infra';
import { ProcessesModule } from './processes';

@Module({
	imports: [ConfigModule, CoreModule, InfraModule, ProcessesModule]
})
export class NotificationServiceModule {}
