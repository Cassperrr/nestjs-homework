import {
	type DepositPaidSuccessPayload,
	KAFKA_TOPICS,
	type TransferInitedPayload
} from '@contracts';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { BalanceKafkaService } from './balance-kafka.service';

@Controller()
export class BalanceKafkaController {
	public constructor(
		private readonly balanceKafkaService: BalanceKafkaService
	) {}

	@EventPattern(KAFKA_TOPICS.DEPOSIT_PAID_SUCCESS)
	public handleTxDepositCompleted(
		@Payload() payload: DepositPaidSuccessPayload
	) {
		console.log(payload);
		return;
	}

	@EventPattern(KAFKA_TOPICS.TRANSFER_INITED)
	public handleTxTransferCompleted(
		@Payload() payload: TransferInitedPayload
	) {
		return;
	}
}
