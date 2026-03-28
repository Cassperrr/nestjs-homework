import { getLoggerOptions } from '@libs/utils';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { UserServiceEnv } from './config';
import { grpcSetup } from './grpc.setup';
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
	const isDev = process.env.NODE_ENV === 'development';

	const app = await NestFactory.create(UserServiceModule, {
		logger: getLoggerOptions(isDev)
	});

	const config = app.get(ConfigService<UserServiceEnv, true>);
	const grpcUrl = config.get('USER_GRPC_URL', { infer: true });

	grpcSetup(app, grpcUrl);

	await app.startAllMicroservices();
	await app.init();
}
void bootstrap();
