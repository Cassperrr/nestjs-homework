import {
	type DepositCreditingFailedPayload,
	type DepositCreditingSuccessPayload,
	KAFKA_TOPICS,
	type TransferFailedPayload,
	type TransferSuccessPayload
} from '@contracts';
import { Controller } from '@nestjs/common';
import {
	Ctx,
	EventPattern,
	type KafkaContext,
	Payload
} from '@nestjs/microservices';

import { KafkaProcessService } from './kafka-process.service';

@Controller()
export class KafkaProcessController {
	public constructor(
		private readonly kafkaProcessService: KafkaProcessService
	) {}

	@EventPattern(KAFKA_TOPICS.DEPOSIT_CREDITING_SUCCESS)
	public handleDepositCreditingSuccess(
		@Payload() payload: DepositCreditingSuccessPayload,
		@Ctx() ctx: KafkaContext
	) {
		return this.kafkaProcessService.processingCreditingSuccess(
			payload,
			ctx
		);
	}

	@EventPattern(KAFKA_TOPICS.DEPOSIT_CREDITING_FAILED)
	public handleDepositCreditingPaidFailed(
		@Payload() payload: DepositCreditingFailedPayload,
		@Ctx() ctx: KafkaContext
	) {
		return this.kafkaProcessService.processingCreditingFailed(payload, ctx);
	}

	@EventPattern(KAFKA_TOPICS.TRANFER_SUCCESS)
	public handleTransferSuccess(
		@Payload() payload: TransferSuccessPayload,
		@Ctx() ctx: KafkaContext
	) {
		return this.kafkaProcessService.processingTransferSuccess(payload, ctx);
	}

	@EventPattern(KAFKA_TOPICS.TRANFER_FAILED)
	public handleTransferFailed(
		@Payload() payload: TransferFailedPayload,
		@Ctx() ctx: KafkaContext
	) {
		return this.kafkaProcessService.processingTransferFailed(payload, ctx);
	}
}
