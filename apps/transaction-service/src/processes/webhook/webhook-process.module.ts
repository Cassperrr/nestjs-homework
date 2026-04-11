import { Module } from '@nestjs/common';

import { WebhookProcessController } from './webhook-process.controller';
import { YookassaWebhookService } from './yookassa-webhook.service';

@Module({
	controllers: [WebhookProcessController],
	providers: [YookassaWebhookService]
})
export class WebhookProcessModule {}
