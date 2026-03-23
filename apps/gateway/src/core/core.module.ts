import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { LoggerMiddleware } from '../common/middlewares';

import { ThrottleRequestModule } from './throttler';

@Global()
@Module({
	imports: [ThrottleRequestModule],
	exports: [ThrottleRequestModule]
})
export class CoreModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
