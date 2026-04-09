import { Module } from '@nestjs/common';
import { RmqProducerFactoryModule } from 'libsV2/rmq';

import { MailProducerRmq } from './mail-producer.rmq';

@Module({
	imports: [RmqProducerFactoryModule.registerAsync(['MAIL'])],
	providers: [MailProducerRmq],
	exports: [MailProducerRmq]
})
export class RmqProducersModule {}
