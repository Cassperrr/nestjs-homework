import { Module } from '@nestjs/common';
import { RmqConsumerFactoryModule } from 'libs/rmq';

import { RmqController } from './rmq.controller';

@Module({
	imports: [RmqConsumerFactoryModule.forRoot()],
	controllers: [RmqController]
})
export class RmqModule {}
