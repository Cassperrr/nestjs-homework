import { Global, Module } from '@nestjs/common';

import { GrpcModule } from './grpc';
import { KafkaModule } from './kafka';
import { PrismaModule } from './prisma';
import { RedisModule } from './redis';

@Global()
@Module({
	imports: [PrismaModule, RedisModule, GrpcModule],
	exports: [PrismaModule, RedisModule, GrpcModule]
})
export class InfraModule {}
