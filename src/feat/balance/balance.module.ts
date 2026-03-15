import { Module } from '@nestjs/common';

import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { BalanceResetProcessor } from './job/balance-reset.processor';
import { BalanceResetService } from './job/balance-reset.service';

@Module({
	controllers: [BalanceController],
	providers: [BalanceService, BalanceResetService, BalanceResetProcessor]
})
export class BalanceModule {}
