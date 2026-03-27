import { Module } from '@nestjs/common';

import { BalanceClientGrpc } from './balance-client.grpc';
import { BalanceController } from './balance.controller';

@Module({
	controllers: [BalanceController],
	providers: [BalanceClientGrpc],
	exports: [BalanceClientGrpc]
})
export class BalanceModule {}
