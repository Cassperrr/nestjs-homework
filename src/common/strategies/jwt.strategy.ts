import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { EnvTypes } from 'src/config';
import { IJwtPayload } from 'src/shared';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	public constructor(
		private readonly configService: ConfigService<EnvTypes, true>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET', { infer: true }),
			algorithms: ['HS256']
		});
	}

	public validate(payload: IJwtPayload) {
		return payload;
	}
}
