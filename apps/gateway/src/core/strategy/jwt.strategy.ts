import { GatewayEnv } from '@gateway/src/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'shared';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	public constructor(
		private readonly configService: ConfigService<GatewayEnv, true>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET', { infer: true }),
			algorithms: ['HS256']
		});
	}

	public validate(payload: JwtPayload) {
		return payload;
	}
}
