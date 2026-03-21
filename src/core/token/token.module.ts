import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EnvTypes } from 'src/config';

import { TOKEN_SERVICE } from '../constants';

import { TokenService } from './token.service';

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
			provide: TOKEN_SERVICE,
			useClass: TokenService
		}
	],
	exports: [TOKEN_SERVICE]
})
export class TokenModule {}
