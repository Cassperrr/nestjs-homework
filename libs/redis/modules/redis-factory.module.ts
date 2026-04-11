import { DynamicModule, Module, Provider } from '@nestjs/common';

import { REDIS_OPTIONS } from '../constants';
import type {
	RedisModuleAsyncOptions,
	RedisModuleOptions,
	RedisOptionsFactory
} from '../interfaces';
import { RedisService } from '../services';

@Module({})
export class RedisFactoryModule {
	public static register(options: RedisModuleOptions): DynamicModule {
		return {
			global: true,
			module: RedisFactoryModule,
			providers: [
				{ provide: REDIS_OPTIONS, useValue: options },
				RedisService
			],
			exports: [RedisService]
		};
	}

	public static registerAsync(
		options: RedisModuleAsyncOptions
	): DynamicModule {
		return {
			global: true,
			module: RedisFactoryModule,
			imports: options.imports ?? [],
			providers: [...this.createAsyncProviders(options), RedisService],
			exports: [RedisService]
		};
	}

	private static createAsyncProviders(
		options: RedisModuleAsyncOptions
	): Provider[] {
		if (options.useFactory) {
			return [
				{
					provide: REDIS_OPTIONS,
					useFactory: options.useFactory,
					inject: options.inject ?? []
				}
			];
		}

		const useClass = options.useClass ?? options.useExisting!;
		return [
			{
				provide: REDIS_OPTIONS,
				useFactory: async (factory: RedisOptionsFactory) =>
					factory.createRedisOptions(),
				inject: [useClass]
			},
			// useClass регистрируем как отдельный провайдер только если это новый класс
			...(options.useClass ? [{ provide: useClass, useClass }] : [])
		];
	}
}
