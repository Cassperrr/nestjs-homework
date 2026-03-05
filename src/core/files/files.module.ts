import { Module } from '@nestjs/common';
import { S3Module, S3Service } from 'src/infra';
import { IFileService } from 'src/shared';

@Module({
	imports: [S3Module],
	providers: [
		{
			provide: IFileService,
			useExisting: S3Service
		}
	],
	exports: [IFileService]
})
export class FilesModule {}
