import { Module } from '@nestjs/common';
import { KafkaProducerFactoryModule } from 'libsV2/kafka';

@Module({
	imports: [KafkaProducerFactoryModule.regiserAsync('TRANSACTION')]
})
export class KafkaProcuderModule {}
