import { Global, Module } from '@nestjs/common';

import { WssGateway } from './wss.gateway';

@Global()
@Module({
	providers: [WssGateway],
	exports: [WssGateway]
})
export class WssModule {}
