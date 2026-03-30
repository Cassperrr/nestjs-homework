import { Global, Module } from '@nestjs/common';

import { GrpcClientsModule } from './grpc';

@Global()
@Module({
	imports: [GrpcClientsModule],
	exports: [GrpcClientsModule]
})
export class InfraModule {}
