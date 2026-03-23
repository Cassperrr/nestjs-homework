import { PROTO_PATHS } from '@contracts';
import { createGrpcServer } from '@libs/grpc';
import { getLoggerOptions } from '@libs/utils';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { UserServiceEnv } from './config';
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
	const isDev = process.env.NODE_ENV === 'development';

	const app = await NestFactory.create(UserServiceModule, {
		logger: getLoggerOptions(isDev)
	});

	const config = app.get(ConfigService<UserServiceEnv, true>);
	const grpcUrl = config.get('USER_GRPC_URL', { infer: true });

	createGrpcServer(app, grpcUrl, ['auth'], [PROTO_PATHS.AUTH]);

	await app.startAllMicroservices();
	await app.init();

	const logger = new Logger('UserService Bootstrap');
	logger.log(`INITED`);
}
void bootstrap();
