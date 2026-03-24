import { PROTO_PATHS } from '@contracts';
import { createGrpcServer } from '@libs/grpc';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ACCOUNT_PACKAGE_NAME } from 'contracts/gen/account';
import { AUTH_PACKAGE_NAME } from 'contracts/gen/auth';
import { getLoggerOptions } from 'shared/utils';

import { UserServiceEnv } from './config';
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
	const isDev = process.env.NODE_ENV === 'development';

	const app = await NestFactory.create(UserServiceModule, {
		logger: getLoggerOptions(isDev)
	});

	const config = app.get(ConfigService<UserServiceEnv, true>);
	const grpcUrl = config.get('USER_GRPC_URL', { infer: true });

	createGrpcServer(
		app,
		grpcUrl,
		[AUTH_PACKAGE_NAME, ACCOUNT_PACKAGE_NAME],
		[PROTO_PATHS.AUTH, PROTO_PATHS.ACCOUNT]
	);

	await app.startAllMicroservices();
	await app.init();
}
void bootstrap();
