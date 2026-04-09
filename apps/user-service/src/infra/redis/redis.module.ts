import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserServiceEnv } from '@user-service/src/config';
import { RedisFactoryModule } from 'libsV2/redis';

@Module({
	imports: [
		RedisFactoryModule.registerAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<UserServiceEnv, true>) => ({
				username: config.get('REDIS_USER', { infer: true }),
				password: config.get('REDIS_PASSWORD', { infer: true }),
				host: config.get('REDIS_HOST', { infer: true }),
				port: config.get('REDIS_PORT', { infer: true }),
				db: config.get('REDIS_INDEX', { infer: true }),
				lazyConnect: true,
				maxRetriesPerRequest: 5,
				enableOfflineQueue: true
			})
		})
	]
})
export class RedisModule {}
