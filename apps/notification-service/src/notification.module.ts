import { Module } from '@nestjs/common';

import { ConfigModule } from './config';
import { CoreModule } from './core';
import { NotificationService } from './notification.service';
import { WssModule } from './wss';

@Module({
	imports: [ConfigModule, CoreModule, WssModule],
	providers: [NotificationService]
})
export class NotificationModule {}
