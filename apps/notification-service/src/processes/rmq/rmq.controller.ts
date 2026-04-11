import {
	type DepositCreditedPayload,
	RMQ_PATTERNS,
	type TransferCompletedPayload
} from '@contracts';
import { Controller } from '@nestjs/common';
import {
	Ctx,
	EventPattern,
	Payload,
	type RmqContext
} from '@nestjs/microservices';
import { TransactionDocService } from '@notification-service/src/infra';
import { RmqConsumerService } from 'libs/rmq';

import { WssGateway } from '../wss';

@Controller()
export class RmqController {
	constructor(
		private readonly rmqService: RmqConsumerService,
		private readonly wssGateway: WssGateway,
		private readonly docService: TransactionDocService
	) {}

	@EventPattern(RMQ_PATTERNS.DEPOSIT_CREDITED)
	public async depositCredited(
		@Payload() payload: DepositCreditedPayload,
		@Ctx() ctx: RmqContext
	) {
		this.wssGateway.sendNotification(
			payload.accountId,
			RMQ_PATTERNS.DEPOSIT_CREDITED,
			payload
		);
		this.rmqService.ack(ctx);
		await this.docService.saveDepositMessage(payload);
	}

	@EventPattern(RMQ_PATTERNS.TRANSFER_COMPLETED)
	public async transferCompleted(
		@Payload() payload: TransferCompletedPayload,
		@Ctx() ctx: RmqContext
	) {
		this.wssGateway.sendNotification(
			payload.fromAccountId,
			RMQ_PATTERNS.TRANSFER_COMPLETED,
			payload
		);
		this.wssGateway.sendNotification(
			payload.toAccountId,
			RMQ_PATTERNS.TRANSFER_COMPLETED,
			payload
		);
		this.rmqService.ack(ctx);
		await this.docService.saveTransferMessage(payload);
	}
}
