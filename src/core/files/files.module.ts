import { Module } from '@nestjs/common';
import { S3Service } from 'src/infra';
import { AbstractFileService } from 'src/shared';

@Module({
	providers: [
		{
			provide: AbstractFileService,
			useExisting: S3Service
		}
	],
	exports: [AbstractFileService]
})
export class FilesModule {}
