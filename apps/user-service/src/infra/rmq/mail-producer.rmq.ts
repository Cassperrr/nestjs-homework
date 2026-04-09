import { OtpRequestedPayload } from '@contracts';
import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { InjectRmqProducer } from 'libsV2/rmq';
import { RMQ_CLIENTS } from 'registries';

@Injectable()
export class MailProducerRmq implements OnModuleInit {
	private readonly logger = new Logger(MailProducerRmq.name);

	public constructor(
		@InjectRmqProducer('MAIL') private readonly client: ClientRMQ
	) {}

	public onModuleInit() {
		this.logger.warn('Пакет клиента RMQ зарегистрирован');
	}

	public async otpRequested(payload: OtpRequestedPayload) {
		return this.client.emit(
			RMQ_CLIENTS.MAIL.patterns.otp_requested,
			payload
		);
	}
}
