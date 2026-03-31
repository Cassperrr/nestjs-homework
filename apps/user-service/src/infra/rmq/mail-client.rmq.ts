import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRmqClient } from 'libs/rmq';
import { RMQ_CLIENTS } from 'libs/rmq/client';
import { OtpRequestedEvent } from 'shared';

@Injectable()
export class MailClientRmq {
	public constructor(
		@InjectRmqClient('MAIL_CLIENT') private readonly client: ClientProxy
	) {}

	public async otpRequested(data: OtpRequestedEvent) {
		return this.client.emit(
			RMQ_CLIENTS.MAIL_CLIENT.patterns.otpRequested,
			data
		);
	}
}
