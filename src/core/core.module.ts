import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtStrategy, LoggerMiddleware, RolesGuard } from 'src/common';
import { RepositoriesModule } from 'src/infra';

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
		SessionModule,
		RepositoriesModule
	],
	providers: [JwtStrategy, RolesGuard],
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
