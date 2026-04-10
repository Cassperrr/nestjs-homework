import { Module } from '@nestjs/common';
import { RmqConsumerFactoryModule } from 'libsV2/rmq';

import { ConfigModule } from './config';
import { SmtpModule } from './infra';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
	imports: [ConfigModule, RmqConsumerFactoryModule.forRoot(), SmtpModule],
	controllers: [MailController],
	providers: [MailService]
})
export class MailModule {}
