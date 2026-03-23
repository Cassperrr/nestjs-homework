import { Global, Module } from '@nestjs/common';

import { PrismaModule } from './prisma';
import { RedisModule } from './redis';

@Global()
@Module({
	imports: [PrismaModule, RedisModule],
	exports: [PrismaModule, RedisModule]
})
export class InfraModule {}
