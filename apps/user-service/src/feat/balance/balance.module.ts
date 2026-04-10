import { Module } from '@nestjs/common';

import { BalanceKafkaController } from './balance-kafka.controller';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';

@Module({
	controllers: [BalanceController, BalanceKafkaController],
	providers: [BalanceService]
})
export class BalanceModule {}
