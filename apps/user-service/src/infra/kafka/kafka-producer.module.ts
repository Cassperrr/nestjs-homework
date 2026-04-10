import { Module } from '@nestjs/common';
import { KafkaProducerFactoryModule } from 'libsV2/kafka';

@Module({
	imports: [KafkaProducerFactoryModule.regiserAsync('USER')]
})
export class KafkaProcuderModule {}
