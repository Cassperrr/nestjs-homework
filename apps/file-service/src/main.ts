import { getLoggerOptions } from '@libs/utils';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { appSetup } from './app.setup';
import { FileServiceEnv } from './config';
import { FileServiceModule } from './file.module';

async function bootstrap() {
	const isDev = process.env.NODE_ENV === 'development';

	const app = await NestFactory.create(FileServiceModule, {
		logger: getLoggerOptions(isDev)
	});

	const config = app.get(ConfigService<FileServiceEnv, true>);
	const port = config.get('FILE_SERVICE_PORT', { infer: true });

	appSetup(app, isDev);

	await app.listen(port);
}
void bootstrap();
