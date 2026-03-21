import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtStrategy, LoggerMiddleware, RolesGuard } from 'src/common';

import { CacheModule } from './cache';
import { CronModule } from './cron';
import { EventModule } from './event';
import { FilesModule } from './files';
import { HashModule } from './hash';
import { OtpModule } from './otp';
import { QueueModule } from './queue';
import { RepositoriesModule } from './repositories';
import { SessionModule } from './session';
import { ThrottleRequestModule } from './throttler';
import { TokenModule } from './token';

@Global()
@Module({
	imports: [
		ThrottleRequestModule,
		CronModule,
		EventModule,
		QueueModule,
		HashModule,
		TokenModule,
		OtpModule,
		SessionModule,
		CacheModule,
		FilesModule,
		RepositoriesModule
	],
	providers: [JwtStrategy, RolesGuard],
	exports: [
		ThrottleRequestModule,
		CronModule,
		EventModule,
		QueueModule,
		HashModule,
		TokenModule,
		OtpModule,
		SessionModule,
		CacheModule,
		FilesModule,
		RepositoriesModule
	]
})
export class CoreModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
