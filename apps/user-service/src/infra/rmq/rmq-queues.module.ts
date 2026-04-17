import { Module } from '@nestjs/common';
import { RmqQueueFactoryModule } from 'libs/rmq';

@Module({
	imports: [RmqQueueFactoryModule.registerAsync(['MAIL', 'NOTIFICATION'])]
})
export class RmqQueuesModule {}
