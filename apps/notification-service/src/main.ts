import { getLoggerOptions } from '@libs/utils';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { NotificationEnv } from './config';
import { NotificationModule } from './notification.module';

async function bootstrap() {
	const isDev = process.env.NODE_ENV === 'development';

	const app = await NestFactory.create(NotificationModule, {
		logger: getLoggerOptions(isDev)
	});

	const config = app.get(ConfigService<NotificationEnv, true>);
	const port = config.get('WSS_PORT', { infer: true });

	await app.listen(port);
}
void bootstrap();
