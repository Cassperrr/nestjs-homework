import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TxServiceEnv } from '@transaction-service/src/config';
import { KafkaConsumerFactoryModule } from 'libs/kafka';

import { TransactionConsumerService } from './transaction-consumer.service';

@Module({
	imports: [
		KafkaConsumerFactoryModule.registerAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<TxServiceEnv, true>) => ({
				kafkaConfig: {
					brokers: [config.get('KAFKA_BROKER', { infer: true })],
					clientId: 'transaction-service'
				},
				consumerConfig: {
					groupId: 'transaction-service-group'
				}
			})
		})
	],
	providers: [TransactionConsumerService]
})
export class TransactionConsumerModule {}
