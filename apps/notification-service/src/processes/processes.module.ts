import { Global, Module } from '@nestjs/common';

import { RmqModule } from './rmq';
import { WssModule } from './wss';

@Global()
@Module({
	imports: [RmqModule, WssModule],
	exports: [RmqModule, WssModule]
})
export class ProcessesModule {}
