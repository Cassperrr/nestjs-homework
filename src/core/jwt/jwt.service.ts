import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { JwtPayload } from 'src/shared';

@Injectable()
export class JwtPassportService {
	public constructor(
		private readonly jwtService: JwtService,
		private readonly accessTtl: StringValue,
		private readonly refreshTtl: StringValue
	) {}

	public sign(payload: JwtPayload, type: 'access' | 'refresh') {
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
