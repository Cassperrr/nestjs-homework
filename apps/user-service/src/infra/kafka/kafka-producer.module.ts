import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserServiceEnv } from '@user-service/src/config';
import { KafkaProducerFactoryModule } from 'libs/kafka';

@Module({
	imports: [
		KafkaProducerFactoryModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<UserServiceEnv, true>) => ({
				kafkaConfig: {
					clientId: 'user-service',
					brokers: [config.get('KAFKA_BROKER', { infer: true })]
				}
			})
		})
	]
})
export class KafkaProcuderModule {}
