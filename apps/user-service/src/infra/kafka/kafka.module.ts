import { Module } from '@nestjs/common';

import { KafkaConsumerService } from './kafka.consumer';
import { KafkaProducerService } from './kafka.producer';

@Module({
	providers: [KafkaProducerService, KafkaConsumerService],
	exports: [KafkaProducerService, KafkaConsumerService]
})
export class KafkaModule {}
