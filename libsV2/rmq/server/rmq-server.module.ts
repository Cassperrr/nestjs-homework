import { Global, Module } from '@nestjs/common';

import { RmqServerService } from './rmq-server.service';

@Global()
@Module({
	providers: [RmqServerService],
	exports: [RmqServerService]
})
export class RmqServerModule {}
