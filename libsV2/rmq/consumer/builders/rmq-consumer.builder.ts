import { type INestApplication, Logger } from '@nestjs/common';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RMQ_QUEUES } from 'registries';

export function createRmqConsumer(
	app: INestApplication,
	urls: string[],
	queue: (typeof RMQ_QUEUES)[keyof typeof RMQ_QUEUES]['name']
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

	const logger = new Logger('RmqConsumerBuilder');
	logger.warn(`RMQ Consumer слушает "${queue}" очередь`);
}
