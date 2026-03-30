import { ModuleMetadata, Type } from '@nestjs/common';
import { RedisOptions } from 'ioredis';

export type RedisModuleOptions = RedisOptions;

export interface RedisOptionsFactory {
	createRedisOptions(): Promise<RedisModuleOptions> | RedisModuleOptions;
}

export interface RedisModuleAsyncOptions extends Pick<
	ModuleMetadata,
	'imports'
> {
	useFactory?: (
		...args: any[]
	) => Promise<RedisModuleOptions> | RedisModuleOptions;
	inject?: any[];
	useClass?: Type<RedisOptionsFactory>;
	useExisting?: Type<RedisOptionsFactory>;
}
