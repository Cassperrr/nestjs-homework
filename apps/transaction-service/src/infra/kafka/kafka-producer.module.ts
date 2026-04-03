import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TxServiceEnv } from '@transaction-service/src/config';
import { KafkaProducerFactoryModule } from 'libs/kafka';

@Module({
	imports: [
		KafkaProducerFactoryModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<TxServiceEnv, true>) => ({
				kafkaConfig: {
					clientId: 'transaction-service-outbox',
					brokers: [config.get('KAFKA_BROKER', { infer: true })]
				}
			})
		})
	]
})
export class KafkaProcuderModule {}
