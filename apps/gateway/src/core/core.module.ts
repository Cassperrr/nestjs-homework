import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { LoggerMiddleware } from '../common/middlewares';

import { CookieModule } from './cookie';
import { StrategyModule } from './strategy';
import { ThrottleRequestModule } from './throttler';

@Global()
@Module({
	imports: [ThrottleRequestModule, StrategyModule, CookieModule],
	exports: [ThrottleRequestModule, StrategyModule, CookieModule]
})
export class CoreModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
