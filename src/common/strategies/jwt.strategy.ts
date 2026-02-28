import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { EnvTypes } from 'src/config';
import { AccountRepository } from 'src/infra';
import { JwtPayload } from 'src/shared';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	public constructor(
		private readonly accountRepo: AccountRepository,
		private readonly configService: ConfigService<EnvTypes, true>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET', { infer: true }),
			algorithms: ['HS256']
		});
	}

	public async validate(payload: JwtPayload) {
		const account = await this.accountRepo.findById(payload.id);
		if (!account) throw new UnauthorizedException('Недействительный токен');
		return { id: account.id, role: account.role };
	}
}
