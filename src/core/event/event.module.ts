import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
	imports: [
		EventEmitterModule.forRoot({
			ignoreErrors: true
		})
	]
})
export class EventModule {}
