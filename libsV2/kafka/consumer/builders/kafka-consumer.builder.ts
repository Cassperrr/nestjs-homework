import { type INestApplication, Logger } from '@nestjs/common';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { KAFKA_PRODUCERS } from 'registries';

export function createKafkaConsumer(
	app: INestApplication,
	brokers: string[],
	clientId: (typeof KAFKA_PRODUCERS)[keyof typeof KAFKA_PRODUCERS]['id'],
	groupId: (typeof KAFKA_PRODUCERS)[keyof typeof KAFKA_PRODUCERS]['groupId']
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

	const logger = new Logger('KafkaConsumerBuilder');
	logger.warn(`Kafka Consumer "${clientId}" запущен`);
}
