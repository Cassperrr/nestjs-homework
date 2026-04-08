import { type INestApplication } from '@nestjs/common';
import { createKafkaConsumer } from 'libs/kafka';

export const kafkaSetup = (
	app: INestApplication,
	clientId: string,
	groupId: string,
	brokers: string[]
) => {
	createKafkaConsumer(app, clientId, groupId, brokers);
};
