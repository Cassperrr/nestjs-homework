import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EnvTypes } from 'src/config';

import { JwtPassportService } from './jwt.service';

export const JWT_PASSPORT_SERVICE = Symbol('JWT_PASSPORT_SERVICE');

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService<EnvTypes, true>) => {
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
			provide: JWT_PASSPORT_SERVICE,
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
				return new JwtPassportService(
					jwtService,
					accessTtl,
					refreshTtl
				);
			},
			inject: [JwtService, ConfigService]
		}
	],
	exports: [JWT_PASSPORT_SERVICE]
})
export class JwtPassportModule {}
