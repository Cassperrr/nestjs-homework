import { getLoggerOptions } from '@libs/utils';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import type { EnvTypes } from './config';
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
	const isDev = process.env.NODE_ENV === 'development';

	const app = await NestFactory.create(UserServiceModule, {
		logger: getLoggerOptions(isDev)
	});

	const config = app.get(ConfigService<EnvTypes, true>);
	const port = config.get('APP_PORT', { infer: true });

	const logger = new Logger('UserService Bootstrap');
	logger.log(`App listen to port: ${port}`);

	await app.listen(port);
}
void bootstrap();
