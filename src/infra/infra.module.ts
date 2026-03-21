import { Global, Module } from '@nestjs/common';

import { PrismaModule } from './prisma';
import { RedisModule } from './redis';
import { S3Module } from './s3';

@Global()
@Module({
	imports: [PrismaModule, RedisModule, S3Module],
	exports: [PrismaModule, RedisModule, S3Module]
})
export class InfraModule {}
