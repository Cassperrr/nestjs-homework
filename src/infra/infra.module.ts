import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma';
import { RedisModule } from './redis';
import { RepositoriesModule } from './repositories';

@Module({
	imports: [PrismaModule, RedisModule, RepositoriesModule]
})
export class InfraModule {}
