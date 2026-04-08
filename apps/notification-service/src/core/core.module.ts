import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { NotificationEnv } from '../config';

@Global()
@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: (
				configService: ConfigService<NotificationEnv, true>
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
	exports: [JwtModule]
})
export class CoreModule {}
