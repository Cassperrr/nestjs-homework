import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserServiceEnv } from '@user-service/src/config';
import { KafkaConsumerFactoryModule, KafkaTopics } from 'libs/kafka';

import { BalanceConsumerService } from './balance-consumer.service';

@Module({
	imports: [
		KafkaConsumerFactoryModule.registerAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<UserServiceEnv, true>) => ({
				kafkaConfig: {
					brokers: [config.get('KAFKA_BROKER', { infer: true })],
					clientId: 'balance-service'
				},
				consumerConfig: {
					groupId: 'balance-service-group'
				},
				topics: [
					KafkaTopics.TX_DEPOSIT_COMPLETED,
					KafkaTopics.TX_TRANSFER_PENDING
				]
			})
		})
	],
	providers: [BalanceConsumerService]
})
export class BalanceConsumerModule {}
