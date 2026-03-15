import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { appSetup } from './app.setup';
import type { EnvTypes } from './config';

async function bootstrap() {
	const isDev = process.env.NODE_ENV === 'development';

	const app = await NestFactory.create(AppModule, {
		logger: isDev
			? ['log', 'error', 'warn', 'debug', 'verbose']
			: ['log', 'error', 'warn']
	});

	const config = app.get(ConfigService<EnvTypes, true>);
	const port = config.get('APP_PORT', { infer: true });

	appSetup(app, isDev);

	const logger = new Logger('Bootstrap');
	logger.log(`App listen to port: ${port}`);

	await app.listen(port);
}
void bootstrap();
