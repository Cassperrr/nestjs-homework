import { type INestApplication } from '@nestjs/common';
import { createKafkaConsumer } from 'libs/kafka';

export const kafkaSetup = (app: INestApplication, brokers: string[]) =>
	createKafkaConsumer(
		app,
		brokers,
		'transaction-service',
		'transaction-service-group'
	);
