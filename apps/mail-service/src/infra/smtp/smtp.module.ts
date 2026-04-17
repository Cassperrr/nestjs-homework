import { MailServiceEnv } from '@mail-service/src/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [
		MailerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<MailServiceEnv, true>) => ({
				transport: {
					host: config.get('SMTP_HOST', { infer: true }),
					port: config.get('SMTP_PORT', { infer: true }),
					ignoreTLS: true
				},
				defaults: {
					from: 'noreply@app.local'
				}
			})
		})
	]
})
export class SmtpModule {}
