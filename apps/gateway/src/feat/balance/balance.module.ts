import { Module } from '@nestjs/common';

import { BalanceController } from './balance.controller';
import { BalanceClientGrpc } from './balance.grpc';

@Module({
	controllers: [BalanceController],
	providers: [BalanceClientGrpc],
	exports: [BalanceClientGrpc]
})
export class BalanceModule {}
