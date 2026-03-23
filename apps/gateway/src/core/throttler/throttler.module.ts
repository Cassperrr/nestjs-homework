import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { GatewayEnv } from '../../config';

@Module({
	imports: [
		ThrottlerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService<GatewayEnv, true>) => [
				{
					ttl: configService.get('THROTTLER_TTL', { infer: true }),
					limit: configService.get('THROTTLER_LIMIT', { infer: true })
				}
			]
		})
	],
	providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }]
})
export class ThrottleRequestModule {}
