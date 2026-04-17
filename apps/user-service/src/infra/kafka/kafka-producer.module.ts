import { Module } from '@nestjs/common';
import { KafkaProducerFactoryModule } from 'libs/kafka';

@Module({
	imports: [KafkaProducerFactoryModule.registerAsync('USER')]
})
export class KafkaProcuderModule {}
