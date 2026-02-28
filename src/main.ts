import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { appSetup } from './app.setup';
import type { EnvTypes } from './config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = app.get(ConfigService<EnvTypes, true>);
	const port = config.get('APP_PORT', { infer: true });
	const isDev = config.get('NODE_ENV', { infer: true }) === 'development';

	appSetup(app, isDev);

	const logger = new Logger('Bootstrap');
	logger.log(`App listen to port: ${port}`);

	await app.listen(port);
}
bootstrap();
