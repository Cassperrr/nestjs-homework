import { Controller } from '@nestjs/common';
import {
	Ctx,
	EventPattern,
	Payload,
	type RmqContext
} from '@nestjs/microservices';
import { RmqService } from 'libs/rmq';
import { RMQ_CLIENTS } from 'libs/rmq/client/rmq-client.registry';
import type { OtpRequestedEvent } from 'shared';

import { MailService } from './mail.service';

@Controller()
export class MailController {
	constructor(
		private readonly mailService: MailService,
		private readonly rmqService: RmqService
	) {}

	@EventPattern(RMQ_CLIENTS.MAIL_CLIENT.patterns['otp.requested'])
	public async otpRegister(
		@Payload() data: OtpRequestedEvent,
		@Ctx() ctx: RmqContext
	) {
		try {
			this.rmqService.ack(ctx);
		} catch (e) {
			this.rmqService.nack(ctx);
		}
	}
}
