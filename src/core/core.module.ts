import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtStrategy, LoggerMiddleware, RolesGuard } from 'src/common';

import { HashModule } from './hash';
import { JwtPassportModule } from './jwt';
import { OtpModule } from './otp';
import { RepositoriesModule } from './repositories';
import { SessionModule } from './session';
import { ThrottleRequestModule } from './throttler';

@Global()
@Module({
	imports: [
		ThrottleRequestModule,
		HashModule,
		JwtPassportModule,
		OtpModule,
		SessionModule,
		RepositoriesModule
	],
	providers: [JwtStrategy, RolesGuard],
	exports: [
		ThrottleRequestModule,
		HashModule,
		JwtPassportModule,
		OtpModule,
		SessionModule,
		RepositoriesModule
	]
})
export class CoreModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
