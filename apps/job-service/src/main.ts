import { getLoggerOptions } from '@libs/utils';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { JobServiceEnv } from './config';
import { grpcSetup } from './grpc.setup';
import { JobModule } from './job.module';

async function bootstrap() {
	const isDev = process.env.NODE_ENV === 'development';

	const app = await NestFactory.create(JobModule, {
		logger: getLoggerOptions(isDev)
	});

	const config = app.get(ConfigService<JobServiceEnv, true>);
	const grpcUrl = config.get('JOB_GRPC_URL', { infer: true });

	grpcSetup(app, grpcUrl);

	await app.startAllMicroservices();
	await app.init();
}
void bootstrap();
