import { Module } from '@nestjs/common';

import { CACHE_SERVICE } from '../constants';

import { CacheService } from './cache.service';

@Module({
	providers: [
		{
			provide: CACHE_SERVICE,
			useClass: CacheService
		}
	],
	exports: [CACHE_SERVICE]
})
export class CacheModule {}
