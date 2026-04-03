import { DynamicModule, Module, Provider } from '@nestjs/common';

import { YOOKASSA_OPTIONS } from './constants';
import type {
	YookassaModuleAsyncOptions,
	YookassaModuleOptions
} from './interfaces';
import { YookassaService } from './yookassa.service';

@Module({})
export class YookassaFactoryModule {
	static forRoot(options: YookassaModuleOptions): DynamicModule {
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

	static forRootAsync(options: YookassaModuleAsyncOptions): DynamicModule {
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
