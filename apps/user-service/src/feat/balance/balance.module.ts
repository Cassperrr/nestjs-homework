import { Module } from '@nestjs/common';

import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { BalanceConsumerModule } from './consumer/balance-consumer.module';

@Module({
	imports: [BalanceConsumerModule],
	controllers: [BalanceController],
	providers: [BalanceService]
})
export class BalanceModule {}
