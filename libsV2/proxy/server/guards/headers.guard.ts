import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { TOKEN_VALIDATORS } from 'registries';

import { HEADERS_KEY } from '../constants';

/**
 * Guard для валидации headers со стороны прокси сервера для авторизированных запросов между proxy-микросервисами
 */
@Injectable()
export class HeadersGuard implements CanActivate {
	public constructor(
		private reflector: Reflector,
		private readonly config: ConfigService
	) {}

	public canActivate(ctx: ExecutionContext): boolean {
		const headers = this.reflector.get<string[] | undefined>(
			HEADERS_KEY,
			ctx.getHandler()
		);

		if (!headers) throw new BadRequestException('Headers не найдены');

		const req = ctx.switchToHttp().getRequest<Request>();

		for (const header of headers) {
			if (!req.headers[header]) {
				throw new BadRequestException(`Header ${header} не найден`);
			}
		}

		for (const [header, envKey] of Object.entries(TOKEN_VALIDATORS)) {
			if (headers.includes(header)) {
				const incoming = req.headers[header] as string;
				const expected = this.config.get<string>(envKey);

				if (incoming !== expected) {
					throw new UnauthorizedException(
						`Header ${header} невалидный`
					);
				}
			}
		}

		return true;
	}
}
