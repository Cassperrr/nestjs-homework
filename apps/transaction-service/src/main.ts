import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { getLoggerOptions } from 'libsV2/utils';

import { appSetup } from './app.setup';
import { TxServiceEnv } from './config';
import { grpcSetup } from './grpc.setup';
import { TransactionModule } from './transaction.module';

async function bootstrap() {
	const isDev = process.env.NODE_ENV === 'development';

	const app = await NestFactory.create(TransactionModule, {
		logger: getLoggerOptions(isDev)
	});

	const config = app.get(ConfigService<TxServiceEnv, true>);
	const grpcUrl = config.get('TRANSACTION_GRPC_URL', { infer: true });
	const port = config.get('HTTP_PORT', { infer: true });
	const trustNumber = config.get('TRUST_PROXY_NUMBER', { infer: true });

	grpcSetup(app, grpcUrl);
	appSetup(app, trustNumber);

	await app.startAllMicroservices();

	await app.listen(port, () => {
		const logger = new Logger('HTTP SERVER');
		logger.log(`Listen to port ${port}`);
	});
}
void bootstrap();
