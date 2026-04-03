import { Global, Module } from '@nestjs/common';

import { GrpcClientsModule } from './grpc';
import { PrismaModule } from './prisma';
import { RedisModule } from './redis';
import { RmqClientsModule } from './rmq';

@Global()
@Module({
	imports: [PrismaModule, RedisModule, GrpcClientsModule, RmqClientsModule],
	exports: [PrismaModule, RedisModule, GrpcClientsModule, RmqClientsModule]
})
export class InfraModule {}
