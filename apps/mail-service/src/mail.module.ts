import { Module } from '@nestjs/common';
import { RmqServerModule } from 'libs/rmq';

import { ConfigModule } from './config';
import { SmtpModule } from './infra/smtp';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
	imports: [ConfigModule, RmqServerModule, SmtpModule],
	controllers: [MailController],
	providers: [MailService]
})
export class MailModule {}
