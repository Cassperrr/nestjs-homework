import { type INestApplication, Logger } from '@nestjs/common';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';

export function createRmqServer(
	app: INestApplication,
	urls: string[],
	queue: string
) {
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls,
			queue,
			queueOptions: {
				durable: true
			},
			noAck: false,
			prefetchCount: 1,
			persistent: true
		}
	});

	const logger = new Logger('Builer RMQ Consumer Server');
	logger.warn(`Кластер серверов для RMQ Consumer запущен`);
}
