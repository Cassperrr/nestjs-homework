import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvTypes } from 'src/config';

import { HashService } from './hash.service';

export const HASH_SERVICE = Symbol('HASH_SERVICE');

@Module({
	providers: [
		{
			provide: HASH_SERVICE,
			useFactory: (configService: ConfigService<EnvTypes, true>) => {
				const pepper = configService.get('HASH_PEPPER', {
					infer: true
				});
				const memoryCost = configService.get('MEMORY_COST', {
					infer: true
				});
				const timeCost = configService.get('TIME_COST', {
					infer: true
				});
				const parallelism = configService.get('PARALLELISM', {
					infer: true
				});

				return new HashService(
					pepper,
					memoryCost,
					timeCost,
					parallelism
				);
			},
			inject: [ConfigService]
		}
	],
	exports: [HASH_SERVICE]
})
export class HashModule {}
