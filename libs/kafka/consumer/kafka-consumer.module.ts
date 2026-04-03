import { type DynamicModule, Module, Provider } from '@nestjs/common';

import { KAFKA_CONSUMER_OPTIONS } from '../constants';
import { KafkaConsumerModuleAsyncOptions } from '../interfaces';

@Module({})
export class KafkaConsumerFactoryModule {
	static registerAsync(
		options: KafkaConsumerModuleAsyncOptions
	): DynamicModule {
		const optionsProvider: Provider = {
			provide: KAFKA_CONSUMER_OPTIONS,
			useFactory: options.useFactory,
			inject: options.inject ?? []
		};

		return {
			module: KafkaConsumerFactoryModule,
			imports: options.imports ?? [],
			providers: [optionsProvider],
			exports: [optionsProvider]
		};
	}
}
