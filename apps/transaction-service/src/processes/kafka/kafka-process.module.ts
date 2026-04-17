import { Module } from '@nestjs/common';

import { KafkaProcessController } from './kafka-process.controller';
import { KafkaProcessService } from './kafka-process.service';

@Module({
	controllers: [KafkaProcessController],
	providers: [KafkaProcessService]
})
export class KafkaProcessModule {}
