import { Module } from '@nestjs/common';

import { ConfigModule } from './config';
import { CoreModule } from './core';
import { MongoModule } from './infra';
import { RmqModule } from './rmq';
import { WssModule } from './wss';

@Module({
	imports: [ConfigModule, CoreModule, WssModule, RmqModule, MongoModule]
})
export class NotificationServiceModule {}
