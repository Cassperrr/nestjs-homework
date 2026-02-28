import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvTypes } from 'src/config';
import { RedisModule, RedisService } from 'src/infra';

import { OtpService } from './otp.service';

export const OTP_SERVICE = Symbol('OTP_SERVICE');

@Module({
	imports: [RedisModule],
	providers: [
		{
			provide: OTP_SERVICE,
			useFactory: (
				configService: ConfigService<EnvTypes, true>,
				redisService: RedisService
			) => {
				const expireTtl = configService.get('OTP_CODE_TTL', {
					infer: true
				});
				const attemptsCount = configService.get('OTP_ATTEMPTS_COUNT', {
					infer: true
				});
				const cooldownTtl = configService.get('COOLDOWN_TTL', {
					infer: true
				});
				return new OtpService(
					redisService,
					expireTtl,
					attemptsCount,
					cooldownTtl
				);
			},
			inject: [ConfigService, RedisService]
		}
	],
	exports: [OTP_SERVICE]
})
export class OtpModule {}
