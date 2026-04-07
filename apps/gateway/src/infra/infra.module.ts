import { Global, Module } from '@nestjs/common';

import { GrpcClientsModule } from './grpc';
import { ProxyClientsModule } from './proxy';

@Global()
@Module({
	imports: [GrpcClientsModule, ProxyClientsModule],
	exports: [GrpcClientsModule, ProxyClientsModule]
})
export class InfraModule {}
