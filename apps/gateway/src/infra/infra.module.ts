import { Global, Module } from '@nestjs/common';

import { GrpcModule } from './grpc';
import { KafkaModule } from './kafka';
import { ProxyModule } from './proxy';

@Global()
@Module({
	imports: [GrpcModule, ProxyModule],
	exports: [GrpcModule, ProxyModule]
})
export class InfraModule {}
