import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { getLoggerOptions } from 'shared/utils';

import { appSetup } from './app.setup';
import { GatewayEnv } from './config';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
	const isDev = process.env.NODE_ENV === 'development';

	const app = await NestFactory.create(GatewayModule, {
		logger: getLoggerOptions(isDev)
	});

	const config = app.get(ConfigService<GatewayEnv, true>);
	const port = config.get('HTTP_PORT', { infer: true });

	appSetup(app, isDev);

	const logger = new Logger('Gateway Bootstrap');
	logger.log(`App listen to port: ${port}`);

	await app.listen(port);
}
void bootstrap();
