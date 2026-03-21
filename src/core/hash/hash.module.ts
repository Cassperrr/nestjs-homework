import { Module } from '@nestjs/common';

import { HASH_SERVICE } from '../constants';

import { HashService } from './hash.service';

@Module({
	providers: [
		{
			provide: HASH_SERVICE,
			useClass: HashService
		}
	],
	exports: [HASH_SERVICE]
})
export class HashModule {}
