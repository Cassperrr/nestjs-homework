import { GrpcClientModule } from '@libs/grpc';
import { Module } from '@nestjs/common';
import { BALANCE_PACKAGE_NAME } from 'contracts/gen/balance';

import { BalanceClientGrpc } from './balance-client';

@Module({
	imports: [GrpcClientModule.register([BALANCE_PACKAGE_NAME])],
	providers: [BalanceClientGrpc],
	exports: [BalanceClientGrpc]
})
export class GrpcModule {}
