import type { OtpRequestedPayload } from '@contracts';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import type { RmqContext } from '@nestjs/microservices';
import { RmqConsumerService } from 'libsV2/rmq';

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name);

	public constructor(
		private readonly rmqConsumerService: RmqConsumerService,
		private readonly mailer: MailerService
	) {}

	public async sendOtpCode(data: OtpRequestedPayload, ctx: RmqContext) {
		const { code, email } = data;
		try {
			await this.mailer.sendMail({
				to: email,
				subject: 'Ваш код подтверждения',
				html: `<h2>Ваш OTP код: <b>${code}</b></h2>`
			});

			this.rmqConsumerService.ack(ctx);

			this.logger.log(`[${email}] Код OTP успешно отправлен`);
		} catch (e) {
			this.rmqConsumerService.nack(ctx);

			this.logger.error(`[${email}] Ошибка отправки OTP кода`, e);

			throw e;
		}
	}
}
