import { Module } from '@nestjs/common';
import { RmqQueueFactoryModule } from 'libsV2/rmq';

@Module({
	imports: [RmqQueueFactoryModule.registerAsync(['MAIL'])]
})
export class RmqQueuesModule {}
