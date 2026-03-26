import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AbstractRedisService } from 'libs/redis';

import { UserServiceEnv } from '../../config';

@Injectable()
export class RedisService extends AbstractRedisService {
	public constructor(
		private readonly configService: ConfigService<UserServiceEnv, true>
	) {
		super({
			username: configService.get('REDIS_USER', { infer: true }),
			password: configService.get('REDIS_PASSWORD', { infer: true }),
			host: configService.get('REDIS_HOST', { infer: true }),
			port: configService.get('REDIS_PORT', { infer: true }),
			db: configService.get('REDIS_INDEX', { infer: true }),
			lazyConnect: true,
			maxRetriesPerRequest: 5,
			enableOfflineQueue: true
		});
	}
}
