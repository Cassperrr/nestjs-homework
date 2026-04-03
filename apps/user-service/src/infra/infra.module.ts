import { Global, Module } from '@nestjs/common';

import { GrpcClientsModule } from './grpc';
import { KafkaProcuderModule } from './kafka';
import { PrismaModule } from './prisma';
import { RedisModule } from './redis';
import { RmqClientsModule } from './rmq';

@Global()
@Module({
	imports: [
		PrismaModule,
		RedisModule,
		GrpcClientsModule,
		RmqClientsModule,
		KafkaProcuderModule
	],
	exports: [
		PrismaModule,
		RedisModule,
		GrpcClientsModule,
		RmqClientsModule,
		KafkaProcuderModule
	]
})
export class InfraModule {}
