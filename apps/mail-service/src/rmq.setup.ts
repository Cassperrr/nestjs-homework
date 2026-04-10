import type { INestApplication } from '@nestjs/common';
import { createRmqConsumer } from 'libsV2/rmq';

export const rmqSetup = (app: INestApplication, urls: string[]) =>
	createRmqConsumer(app, urls, 'MAIL_QUEUE');
