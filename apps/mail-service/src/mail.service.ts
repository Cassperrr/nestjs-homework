import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { RmqService } from 'libs/rmq';
import { OtpRequestedEvent } from 'shared';

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name);

	public constructor(
		private readonly rmqService: RmqService,
		private readonly mailerService: MailerService
	) {}

	public async sendOtpCode(data: OtpRequestedEvent, ctx: RmqContext) {
		const { code, email } = data;
		try {
			await this.mailerService.sendMail({
				to: email,
				subject: 'Ваш код подтверждения',
				html: `<h2>Ваш OTP код: <b>${code}</b></h2>`
			});

			this.rmqService.ack(ctx);

			this.logger.log(`[${email}] Код OTP успешно отправлен`);
		} catch (e) {
			this.rmqService.nack(ctx);

			this.logger.error(`[${email}] Ошибка отправки OTP кода`, e);

			throw e;
		}
	}
}
