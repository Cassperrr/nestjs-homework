import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtStrategy, LoggerMiddleware, RolesGuard } from 'src/common';

import { FilesModule } from './files';
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
		FilesModule,
		RepositoriesModule
	],
	providers: [JwtStrategy, RolesGuard],
	exports: [
		ThrottleRequestModule,
		HashModule,
		JwtPassportModule,
		OtpModule,
		SessionModule,
		FilesModule,
		RepositoriesModule
	]
})
export class CoreModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
