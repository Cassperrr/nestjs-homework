import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { createRmqServer } from 'libs/rmq';
import { getLoggerOptions } from 'libsV2/utils';

import { MailServiceEnv } from './config';
import { MailModule } from './mail.module';

async function bootstrap() {
	const isDev = process.env.NODE_ENV === 'development';

	const app = await NestFactory.create(MailModule, {
		logger: getLoggerOptions(isDev)
	});

	const config = app.get(ConfigService<MailServiceEnv, true>);
	const rmqUrl = config.get('RMQ_URL', { infer: true });
	const queue = config.get('MAIL_QUEUE', { infer: true });

	createRmqServer(app, [rmqUrl], queue);

	await app.startAllMicroservices();
}
void bootstrap();
