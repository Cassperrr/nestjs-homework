import { Module } from '@nestjs/common';

import { ConfigModule } from './config';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { InfraModule } from './infra';

@Module({
	imports: [ConfigModule, InfraModule],
	controllers: [FileController],
	providers: [FileService]
})
export class FileServiceModule {}
