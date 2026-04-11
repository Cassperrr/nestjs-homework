import { Module } from '@nestjs/common';

import { BalanceKafkaController } from './balance-kafka.controller';
import { BalanceKafkaService } from './balance-kafka.service';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { OutboxWorkerService } from './outbox-worker.service';

@Module({
	controllers: [BalanceController, BalanceKafkaController],
	providers: [BalanceService, BalanceKafkaService, OutboxWorkerService]
})
export class BalanceModule {}
