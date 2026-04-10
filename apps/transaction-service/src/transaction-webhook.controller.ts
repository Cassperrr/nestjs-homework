import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards
} from '@nestjs/common';
import { YookassaIpGuard } from '@transaction-service/src/common';
import type { YookassaWebhookResponse } from 'libsV2/payments';

import { YookassaWebhookService } from './providers';

@Controller('webhook')
export class TransactionWebhookController {
	public constructor(private readonly yookassa: YookassaWebhookService) {}

	@Post('yookassa')
	@UseGuards(YookassaIpGuard)
	@HttpCode(HttpStatus.OK)
	public yookassaWebhook(@Body() data: YookassaWebhookResponse) {
		return this.yookassa.processing(data);
	}
}
