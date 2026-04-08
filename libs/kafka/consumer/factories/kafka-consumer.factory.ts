import { type INestApplication, Logger } from '@nestjs/common';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';

export function createKafkaConsumer(
	app: INestApplication,
	clientId: string,
	groupId: string,
	brokers: string[]
) {
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.KAFKA,
		options: {
			client: {
				clientId,
				brokers
			},
			consumer: {
				groupId
			}
		}
	});

	const logger = new Logger('Builder Kafka Consumer Server');
	logger.warn(`Кластер серверов для Kafka Consumer запущен`);
}
