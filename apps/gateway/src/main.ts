import { getLoggerOptions } from '@libs/utils';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

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

	await app.listen(port, () => {
		const logger = new Logger('HTTP SERVER');
		logger.log(`Listen to port: ${port}`);
	});
}
void bootstrap();
