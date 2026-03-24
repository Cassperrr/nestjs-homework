import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UserServiceEnv } from '@user-service/src/config';
import type { StringValue } from 'ms';
import { JwtPayload } from 'shared';

@Injectable()
export class TokenService {
	private readonly logger = new Logger(TokenService.name);

	private readonly accessTtl: StringValue;
	private readonly refreshTtl: StringValue;

	public constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService<UserServiceEnv, true>
	) {
		this.accessTtl = configService.get('JWT_ACCESS_TOKEN_TTL', {
			infer: true
		});
		this.refreshTtl = configService.get('JWT_REFRESH_TOKEN_TTL', {
			infer: true
		});

		this.logger.debug(`${TokenService.name} created`);
	}

	private sign(payload: JwtPayload, type: 'access' | 'refresh') {
		return this.jwtService.sign(payload, {
			expiresIn: type === 'access' ? this.accessTtl : this.refreshTtl
		});
	}

	public signTokens(payload: JwtPayload) {
		return {
			accessToken: this.sign(payload, 'access'),
			refreshToken: this.sign(payload, 'refresh'),
			refreshTtl: this.refreshTtl
		};
	}

	public verify(token: string): JwtPayload {
		try {
			return this.jwtService.verify(token);
		} catch (e) {
			throw new UnauthorizedException(
				e instanceof TokenExpiredError
					? 'Токен истёк'
					: 'Невалидный токен'
			);
		}
	}
}
