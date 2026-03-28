import { Global, Module } from '@nestjs/common';

import { GrpcModule } from './grpc';
import { StorageModule } from './storage';

@Global()
@Module({
	imports: [GrpcModule, StorageModule],
	exports: [GrpcModule, StorageModule]
})
export class InfraModule {}
