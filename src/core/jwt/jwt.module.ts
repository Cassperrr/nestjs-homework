import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EnvTypes } from 'src/config';

import { JwtTokenService } from './jwt.service';

export const JWT_TOKEN_SERVICE = Symbol('JWT_TOKEN_SERVICE');

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: async (
				configService: ConfigService<EnvTypes, true>
			) => {
				return {
					secret: configService.get('JWT_SECRET', { infer: true }),
					signOptions: {
						algorithm: 'HS256'
					},
					verifyOptions: {
						algorithms: ['HS256'],
						ignoreExpiration: false
					}
				};
			},
			inject: [ConfigService]
		})
	],
	providers: [
		{
			provide: JWT_TOKEN_SERVICE,
			useFactory: (
				jwtService: JwtService,
				configService: ConfigService<EnvTypes, true>
			) => {
				const accessTtl = configService.get('JWT_ACCESS_TOKEN_TTL', {
					infer: true
				});
				const refreshTtl = configService.get('JWT_REFRESH_TOKEN_TTL', {
					infer: true
				});
				return new JwtTokenService(jwtService, accessTtl, refreshTtl);
			},
			inject: [JwtService, ConfigService]
		}
	],
	exports: [JWT_TOKEN_SERVICE]
})
export class JwtTokenModule {}
