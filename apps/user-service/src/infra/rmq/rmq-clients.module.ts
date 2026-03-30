import { Module } from '@nestjs/common';
import { RmqClientModule } from 'libs/rmq';

import { MailClientRmq } from './mail-client.rmq';

@Module({
	imports: [RmqClientModule.register(['MAIL_CLIENT'])],
	providers: [MailClientRmq],
	exports: [MailClientRmq]
})
export class RmqClientsModule {}
