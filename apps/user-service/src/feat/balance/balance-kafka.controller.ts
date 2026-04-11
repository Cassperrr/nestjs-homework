import {
	type DepositPaidSuccessPayload,
	KAFKA_TOPICS,
	type TransferInitedPayload
} from '@contracts';
import { Controller } from '@nestjs/common';
import {
	Ctx,
	EventPattern,
	type KafkaContext,
	Payload
} from '@nestjs/microservices';

import { BalanceKafkaService } from './balance-kafka.service';

@Controller()
export class BalanceKafkaController {
	public constructor(
		private readonly balanceKafkaService: BalanceKafkaService
	) {}

	@EventPattern(KAFKA_TOPICS.DEPOSIT_PAID_SUCCESS)
	public handleDepositPaidSuccess(
		@Payload() payload: DepositPaidSuccessPayload,
		@Ctx() ctx: KafkaContext
	) {
		return this.balanceKafkaService.depositToBalance(payload, ctx);
	}

	@EventPattern(KAFKA_TOPICS.TRANSFER_INITED)
	public handleTransferInited(
		@Payload() payload: TransferInitedPayload,
		@Ctx() ctx: KafkaContext
	) {
		return this.balanceKafkaService.transferToAccount(payload, ctx);
	}
}
