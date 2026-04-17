import { Global, Module } from '@nestjs/common';

import { GrpcClientsModule } from './grpc';
import { KafkaProcuderModule } from './kafka';
import { PrismaModule } from './prisma';
import { RedisModule } from './redis';
import { RmqQueuesModule } from './rmq';

@Global()
@Module({
	imports: [
		PrismaModule,
		RedisModule,
		GrpcClientsModule,
		RmqQueuesModule,
		KafkaProcuderModule
	],
	exports: [
		PrismaModule,
		RedisModule,
		GrpcClientsModule,
		RmqQueuesModule,
		KafkaProcuderModule
	]
})
export class InfraModule {}
