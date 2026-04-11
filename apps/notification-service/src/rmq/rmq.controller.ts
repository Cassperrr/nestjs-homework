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
import { RmqConsumerService } from 'libs/rmq';

import { WssGateway } from '../wss';

@Controller()
export class RmqController {
	constructor(
		private readonly rmqService: RmqConsumerService,
		private readonly wssGateway: WssGateway
	) {}

	@EventPattern(RMQ_PATTERNS.DEPOSIT_CREDITED)
	public async depositCredited(
		@Payload() data: DepositCreditedPayload,
		@Ctx() ctx: RmqContext
	) {
		this.wssGateway.sendNotification(
			data.accountId,
			RMQ_PATTERNS.DEPOSIT_CREDITED,
			data
		);
		this.rmqService.ack(ctx);
	}

	@EventPattern(RMQ_PATTERNS.TRANSFER_COMPLETED)
	public async transferCompleted(
		@Payload() data: TransferCompletedPayload,
		@Ctx() ctx: RmqContext
	) {
		this.wssGateway.sendNotification(
			data.fromAccountId,
			RMQ_PATTERNS.TRANSFER_COMPLETED,
			data
		);
		this.wssGateway.sendNotification(
			data.toAccountId,
			RMQ_PATTERNS.TRANSFER_COMPLETED,
			data
		);
		this.rmqService.ack(ctx);
	}
}
