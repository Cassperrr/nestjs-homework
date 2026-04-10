import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { getLoggerOptions } from 'libsV2/utils';

import { MailServiceEnv } from './config';
import { MailModule } from './mail.module';
import { rmqSetup } from './rmq.setup';

async function bootstrap() {
	const isDev = process.env.NODE_ENV === 'development';

	const app = await NestFactory.create(MailModule, {
		logger: getLoggerOptions(isDev)
	});

	const config = app.get(ConfigService<MailServiceEnv, true>);
	const rmqUrl = config.get('RMQ_URL', { infer: true });

	rmqSetup(app, [rmqUrl]);

	await app.startAllMicroservices();
}
void bootstrap();
