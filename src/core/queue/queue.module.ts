import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvTypes } from 'src/config';

import { QUEUES } from '../constants';

import { QueueService } from './queue.service';

@Module({
	imports: [
		BullModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<EnvTypes, true>) => ({
				connection: {
					host: config.get('REDIS_HOST', { infer: true }),
					port: config.get('REDIS_PORT', { infer: true })
				},
				defaultJobOptions: {
					attempts: 3,
					backoff: { type: 'exponential', delay: 1000 },
					removeOnComplete: true,
					removeOnFail: { count: 100 }
				}
			})
		}),
		BullModule.registerQueue({ name: QUEUES.BALANCE_RESET })
	],
	providers: [QueueService],
	exports: [QueueService, BullModule]
})
export class QueueModule {}
