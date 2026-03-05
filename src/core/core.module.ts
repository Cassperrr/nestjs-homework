import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtStrategy, LoggerMiddleware, RolesGuard } from 'src/common';

import { FilesModule } from './files';
import { HashModule } from './hash';
import { OtpModule } from './otp';
import { RepositoriesModule } from './repositories';
import { SessionModule } from './session';
import { ThrottleRequestModule } from './throttler';
import { TokenModule } from './token';

@Global()
@Module({
	imports: [
		ThrottleRequestModule,
		HashModule,
		TokenModule,
		OtpModule,
		SessionModule,
		FilesModule,
		RepositoriesModule
	],
	providers: [JwtStrategy, RolesGuard],
	exports: [
		ThrottleRequestModule,
		HashModule,
		TokenModule,
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
