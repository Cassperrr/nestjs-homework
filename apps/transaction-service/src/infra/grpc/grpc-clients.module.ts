import { Module } from '@nestjs/common';
import { GrpcClientFactoryModule } from 'libsV2/grpc';

import { BalanceClientGrpc } from './balance-client.grpc';

@Module({
	imports: [GrpcClientFactoryModule.registerAsync(['BALANCE'])],
	providers: [BalanceClientGrpc],
	exports: [BalanceClientGrpc]
})
export class GrpcClientsModule {}
