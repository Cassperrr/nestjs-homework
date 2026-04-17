import { Global, Module } from '@nestjs/common';

import { CronModule } from './cron';
import { QueueModule } from './queue';

@Global()
@Module({
	imports: [CronModule, QueueModule],
	exports: [CronModule, QueueModule]
})
export class CoreModule {}
