import { GatewayEnv } from '@gateway/src/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AbstractKafkaProducerService } from 'libs/kafka';

@Injectable()
export class KafkaProducerService extends AbstractKafkaProducerService {
	public constructor(config: ConfigService<GatewayEnv, true>) {
		super({
			clientId: 'gateway',
			brokers: [config.get('KAFKA_BROKER', { infer: true })]
		});
	}
}
