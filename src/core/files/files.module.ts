import { Module } from '@nestjs/common';
import { S3Service } from 'src/infra';
import { IFileService } from 'src/shared';

@Module({
	providers: [
		{
			provide: IFileService,
			useExisting: S3Service
		}
	],
	exports: [IFileService]
})
export class FilesModule {}
