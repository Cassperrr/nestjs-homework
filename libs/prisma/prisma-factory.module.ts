import { type DynamicModule, Module, type Provider } from '@nestjs/common';

import { PRISMA_CLIENT_TOKEN } from './constants';
import type {
	PrismaClientClass,
	PrismaModuleAsyncOptions,
	PrismaModuleOptions
} from './interfaces';
import { PrismaLifecycleService } from './services';

@Module({})
export class PrismaFactoryModule {
	static forRoot<TClient extends PrismaClientClass>(
		ClientClass: TClient,
		options: PrismaModuleOptions
	): DynamicModule {
		const clientProvider: Provider = {
			provide: PRISMA_CLIENT_TOKEN,
			useFactory: (): InstanceType<TClient> => {
				return new ClientClass({
					adapter: options.adapter
				}) as InstanceType<TClient>;
			}
		};

		return {
			global: true,
			module: PrismaFactoryModule,
			providers: [clientProvider, PrismaLifecycleService],
			exports: [PRISMA_CLIENT_TOKEN]
		};
	}

	static forRootAsync<TClient extends PrismaClientClass>(
		ClientClass: TClient,
		asyncOptions: PrismaModuleAsyncOptions
	): DynamicModule {
		const clientProvider: Provider = {
			provide: PRISMA_CLIENT_TOKEN,
			inject: asyncOptions.inject ?? [],
			useFactory: async (
				...args: any[]
			): Promise<InstanceType<TClient>> => {
				const options = await asyncOptions.useFactory(...args);
				return new ClientClass({
					adapter: options.adapter
				}) as InstanceType<TClient>;
			}
		};

		return {
			global: true,
			module: PrismaFactoryModule,
			imports: asyncOptions.imports ?? [],
			providers: [clientProvider, PrismaLifecycleService],
			exports: [PRISMA_CLIENT_TOKEN]
		};
	}
}
