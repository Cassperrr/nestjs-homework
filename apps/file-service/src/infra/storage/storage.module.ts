import { Module } from '@nestjs/common';

import { AbstractStorageService } from './abstracts';
import { S3Service } from './s3';

@Module({
	providers: [
		{
			provide: AbstractStorageService,
			useClass: S3Service
		}
	],
	exports: [AbstractStorageService]
})
export class StorageModule {}
