import { getLoggerOptions } from '@libs/utils';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { NotificationEnv } from './config';
import { NotificationServiceModule } from './notification-service.module';
import { rmqSetup } from './rmq.setup';

async function bootstrap() {
	const isDev = process.env.NODE_ENV === 'development';

	const app = await NestFactory.create(NotificationServiceModule, {
		logger: getLoggerOptions(isDev)
	});

	const config = app.get(ConfigService<NotificationEnv, true>);
	const port = config.get('WSS_PORT', { infer: true });
	const rmqUrl = config.get('RMQ_URL', { infer: true });

	rmqSetup(app, [rmqUrl]);

	await app.startAllMicroservices();
	await app.listen(port);
}
void bootstrap();
