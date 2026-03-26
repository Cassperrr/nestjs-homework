import { Global, Module } from '@nestjs/common';

import { CacheModule } from './cache';
import { EventModule } from './event';
import { HashModule } from './hash';
import { OtpModule } from './otp';
import { RepositoriesModule } from './repositories';
import { SessionModule } from './session';
import { TokenModule } from './token';

@Global()
@Module({
	imports: [
		RepositoriesModule,
		EventModule,
		CacheModule,
		HashModule,
		OtpModule,
		SessionModule,
		TokenModule
	],
	exports: [
		RepositoriesModule,
		EventModule,
		CacheModule,
		HashModule,
		OtpModule,
		SessionModule,
		TokenModule
	]
})
export class CoreModule {}
