import { GatewayEnv } from '@gateway/src/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';
import ms from 'ms';

@Injectable()
export class CookieService {
	private readonly isDev: boolean;
	private readonly COOKIE_DOMAIN: string;

	public constructor(configService: ConfigService<GatewayEnv, true>) {
		this.isDev =
			configService.get('NODE_ENV', { infer: true }) === 'development';
		this.COOKIE_DOMAIN = configService.get('COOKIE_DOMAIN', {
			infer: true
		});
	}

	public getOptions(refreshTtl: ms.StringValue): CookieOptions {
		return {
			httpOnly: true,
			expires: new Date(Date.now() + ms(refreshTtl)),
			secure: !this.isDev,
			sameSite: 'lax',
			...(this.isDev ? {} : { domain: this.COOKIE_DOMAIN })
		};
	}
}
