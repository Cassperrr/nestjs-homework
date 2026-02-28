import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from 'src/common';

import { HashModule } from './hash';
import { JwtTokenModule } from './jwt';
import { OtpModule } from './otp';
import { SessionModule } from './session';
import { ThrottleRequestModule } from './throttler';

@Global()
@Module({
	imports: [
		ThrottleRequestModule,
		HashModule,
		JwtTokenModule,
		OtpModule,
		SessionModule
	],
	exports: [
		ThrottleRequestModule,
		HashModule,
		JwtTokenModule,
		OtpModule,
		SessionModule
	]
})
export class CoreModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
