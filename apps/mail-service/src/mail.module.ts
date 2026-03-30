import { Module } from '@nestjs/common';
import { RmqModule } from 'libs/rmq';

import { ConfigModule } from './config';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
	imports: [ConfigModule, RmqModule],
	controllers: [MailController],
	providers: [MailService]
})
export class MailModule {}
