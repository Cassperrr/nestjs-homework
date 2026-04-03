import { DynamicModule, Module, Provider } from '@nestjs/common';

import { KAFKA_PRODUCER_OPTIONS } from '../constants';
import type {
	KafkaProducerModuleAsyncOptions,
	KafkaProducerModuleOptions
} from '../interfaces';

import { KafkaProducerService } from './kafka-producer.service';

@Module({})
export class KafkaProducerFactoryModule {
	static forRoot(options: KafkaProducerModuleOptions): DynamicModule {
		return {
			global: true,
			module: KafkaProducerFactoryModule,
			providers: [
				{ provide: KAFKA_PRODUCER_OPTIONS, useValue: options },
				KafkaProducerService
			],
			exports: [KafkaProducerService]
		};
	}

	static forRootAsync(
		options: KafkaProducerModuleAsyncOptions
	): DynamicModule {
		const asyncProvider: Provider = {
			provide: KAFKA_PRODUCER_OPTIONS,
			useFactory: options.useFactory,
			inject: options.inject ?? []
		};

		return {
			global: true,
			module: KafkaProducerFactoryModule,
			imports: options.imports ?? [],
			providers: [asyncProvider, KafkaProducerService],
			exports: [KafkaProducerService]
		};
	}
}
