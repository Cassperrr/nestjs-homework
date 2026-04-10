import { type OtpRequestedPayload, RMQ_PATTERNS } from '@contracts';
import { Controller } from '@nestjs/common';
import {
	Ctx,
	EventPattern,
	Payload,
	type RmqContext
} from '@nestjs/microservices';

import { MailService } from './mail.service';

@Controller()
export class MailController {
	constructor(private readonly mailService: MailService) {}

	@EventPattern(RMQ_PATTERNS.OTP_REQUESTED)
	public async otpRequested(
		@Payload() data: OtpRequestedPayload,
		@Ctx() ctx: RmqContext
	) {
		return this.mailService.sendOtpCode(data, ctx);
	}
}
