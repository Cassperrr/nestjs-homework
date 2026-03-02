import { Global, Module } from '@nestjs/common';

import { PrismaModule } from './prisma';
import { RedisModule } from './redis';
import { RepositoriesModule } from './repositories';

@Global()
@Module({
	imports: [PrismaModule, RedisModule, RepositoriesModule],
	exports: [PrismaModule, RedisModule, RepositoriesModule]
})
export class InfraModule {}
