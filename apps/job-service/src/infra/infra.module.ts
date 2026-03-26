import { Global, Module } from '@nestjs/common';

import { GrpcModule } from './grpc';

@Global()
@Module({
	imports: [GrpcModule],
	exports: [GrpcModule]
})
export class InfraModule {}
