import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { LoggerMiddleware } from '../common/middlewares';

import { CookieModule } from './cookie';
import { GrpcModule } from './grpc';
import { StrategyModule } from './strategy';
import { ThrottleRequestModule } from './throttler';

@Global()
@Module({
	imports: [ThrottleRequestModule, StrategyModule, CookieModule, GrpcModule],
	exports: [ThrottleRequestModule, StrategyModule, CookieModule, GrpcModule]
})
export class CoreModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
