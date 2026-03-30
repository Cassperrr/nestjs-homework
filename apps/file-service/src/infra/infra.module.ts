import { Global, Module } from '@nestjs/common';

import { GrpcClientsModule } from './grpc';
import { StorageModule } from './storage';

@Global()
@Module({
	imports: [GrpcClientsModule, StorageModule],
	exports: [GrpcClientsModule, StorageModule]
})
export class InfraModule {}
