import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma';
import { RedisModule } from './redis';

@Module({
	imports: [PrismaModule, RedisModule]
})
export class InfraModule {}
