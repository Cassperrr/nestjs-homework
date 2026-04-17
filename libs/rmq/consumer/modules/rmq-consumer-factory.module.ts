import { type DynamicModule, Module } from '@nestjs/common';

import { RmqConsumerService } from '../services';

/**
 * Глобально регистрирует реализацию RMQ consumer
 */
@Module({})
export class RmqConsumerFactoryModule {
	public static forRoot(): DynamicModule {
		return {
			global: true,
			module: RmqConsumerFactoryModule,
			providers: [RmqConsumerService],
			exports: [RmqConsumerService]
		};
	}
}
