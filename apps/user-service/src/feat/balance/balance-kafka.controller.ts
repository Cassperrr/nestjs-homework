import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
	type DepositCompletedEvent,
	KafkaTopics,
	type TransferPendingEvent
} from 'libs/kafka';

import { BalanceKafkaService } from './balance-kafka.service';

@Controller()
export class BalanceKafkaController {
	public constructor(
		private readonly balanceKafkaService: BalanceKafkaService
	) {}

	@EventPattern(KafkaTopics.TX_DEPOSIT_COMPLETED)
	public handleTxDepositCompleted(@Payload() payload: DepositCompletedEvent) {
		console.log(payload);
		return this.balanceKafkaService.depositCompleted(payload);
	}

	@EventPattern(KafkaTopics.TX_DEPOSIT_COMPLETED)
	public handleTxTransferCompleted(@Payload() payload: TransferPendingEvent) {
		return this.balanceKafkaService.transferPending(payload);
	}
}
