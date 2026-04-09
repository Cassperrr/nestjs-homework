import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { getLoggerOptions } from 'libsV2/utils';

import { UserServiceEnv } from './config';
import { grpcSetup } from './grpc.setup';
import { kafkaSetup } from './kafka.setup';
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
	const isDev = process.env.NODE_ENV === 'development';

	const app = await NestFactory.create(UserServiceModule, {
		logger: getLoggerOptions(isDev)
	});

	const config = app.get(ConfigService<UserServiceEnv, true>);
	const grpcUrl = config.get('USER_GRPC_URL', { infer: true });
	const kafkaBroker = config.get('KAFKA_BROKER', { infer: true });

	grpcSetup(app, grpcUrl);
	kafkaSetup(app, [kafkaBroker]);

	await app.startAllMicroservices();
	await app.init();
}
void bootstrap();
