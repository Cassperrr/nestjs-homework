import { Module } from '@nestjs/common';

import { WssGateway } from './wss.gateway';
import { WssService } from './wss.service';

@Module({
	providers: [WssGateway, WssService]
})
export class WssModule {}
