import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { EnvTypes } from 'src/config';
import { IJwtPayload } from 'src/shared';

@Injectable()
export class JwtPassportService {
	private readonly logger = new Logger(JwtPassportService.name);

	private readonly accessTtl: StringValue;
	private readonly refreshTtl: StringValue;

	public constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService<EnvTypes, true>
	) {
		this.accessTtl = configService.get('JWT_ACCESS_TOKEN_TTL', {
			infer: true
		});
		this.refreshTtl = configService.get('JWT_REFRESH_TOKEN_TTL', {
			infer: true
		});

		this.logger.debug(`${JwtPassportService.name} created`);
	}

	public sign(payload: IJwtPayload, type: 'access' | 'refresh') {
		return this.jwtService.sign(payload, {
			expiresIn: type === 'access' ? this.accessTtl : this.refreshTtl
		});
	}

	public signTokens(payload: IJwtPayload) {
		return {
			accessToken: this.sign(payload, 'access'),
			refreshToken: this.sign(payload, 'refresh'),
			refreshTtl: this.refreshTtl
		};
	}

	public verify(token: string): IJwtPayload {
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
