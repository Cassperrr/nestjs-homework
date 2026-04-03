import { Global, Module } from '@nestjs/common';

import { GrpcClientsModule } from './grpc';
import { KafkaProcuderModule } from './kafka';
import { PrismaModule } from './prisma';

@Global()
@Module({
	imports: [PrismaModule, GrpcClientsModule, KafkaProcuderModule],
	exports: [PrismaModule, GrpcClientsModule, KafkaProcuderModule]
})
export class InfraModule {}
