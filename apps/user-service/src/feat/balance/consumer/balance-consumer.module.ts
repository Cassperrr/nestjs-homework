import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserServiceEnv } from '@user-service/src/config';
import { KafkaConsumerFactoryModule } from 'libs/kafka';

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
				}
			})
		})
	],
	providers: [BalanceConsumerService]
})
export class BalanceConsumerModule {}
