import { DynamicModule, Module, Provider } from '@nestjs/common';

import { YOOKASSA_OPTIONS } from '../constants';
import type {
	YookassaModuleAsyncOptions,
	YookassaModuleOptions
} from '../interfaces';
import { YookassaService } from '../services';

/**
 * Фабрикует динамический модуль для интеграции с сервисом Yookassa
 */
@Module({})
export class YookassaFactoryModule {
	public static register(options: YookassaModuleOptions): DynamicModule {
		return {
			global: true,
			module: YookassaFactoryModule,
			providers: [
				{ provide: YOOKASSA_OPTIONS, useValue: options },
				YookassaService
			],
			exports: [YookassaService]
		};
	}

	public static registerAsync(
		options: YookassaModuleAsyncOptions
	): DynamicModule {
		const asyncProvider: Provider = {
			provide: YOOKASSA_OPTIONS,
			useFactory: options.useFactory,
			inject: options.inject ?? []
		};

		return {
			global: true,
			module: YookassaFactoryModule,
			imports: options.imports ?? [],
			providers: [asyncProvider, YookassaService],
			exports: [YookassaService]
		};
	}
}
