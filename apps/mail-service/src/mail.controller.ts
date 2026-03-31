import { Controller } from '@nestjs/common';
import {
	Ctx,
	EventPattern,
	Payload,
	type RmqContext
} from '@nestjs/microservices';
import { RMQ_CLIENTS } from 'libs/rmq/client/rmq-client.registry';
import type { OtpRequestedEvent } from 'shared';

import { MailService } from './mail.service';

@Controller()
export class MailController {
	constructor(private readonly mailService: MailService) {}

	@EventPattern(RMQ_CLIENTS.MAIL_CLIENT.patterns.otpRequested)
	public async otpRequested(
		@Payload() data: OtpRequestedEvent,
		@Ctx() ctx: RmqContext
	) {
		return this.mailService.sendOtpCode(data, ctx);
	}
}
