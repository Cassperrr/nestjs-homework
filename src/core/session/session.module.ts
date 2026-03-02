import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvTypes } from 'src/config';
import { RedisService } from 'src/infra';

import { SessionService } from './session.service';

export const SESSION_SERVICE = Symbol('SESSION_SERVICE');

@Module({
	providers: [
		{
			provide: SESSION_SERVICE,
			useFactory: (
				configService: ConfigService<EnvTypes, true>,
				redisService: RedisService
			) => {
				const sessionTtl = configService.get('JWT_REFRESH_TOKEN_TTL', {
					infer: true
				});

				return new SessionService(redisService, sessionTtl);
			},
			inject: [ConfigService, RedisService]
		}
	],
	exports: [SESSION_SERVICE]
})
export class SessionModule {}
