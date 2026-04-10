import { type INestApplication } from '@nestjs/common';
import { createKafkaConsumer } from 'libsV2/kafka';

export const kafkaSetup = (app: INestApplication, brokers: string[]) =>
	createKafkaConsumer(
		app,
		brokers,
		'transaction-service',
		'transaction-service-group'
	);
