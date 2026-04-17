import {
	BadRequestException,
	type CanActivate,
	ExecutionContext,
	Injectable,
	PayloadTooLargeException,
	UnsupportedMediaTypeException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { SIZE_KEY } from '../decorators';

@Injectable()
export class UploadFileGuard implements CanActivate {
	public constructor(private readonly reflector: Reflector) {}

	canActivate(ctx: ExecutionContext): boolean {
		const requiredSize = this.reflector.getAllAndOverride<number>(
			SIZE_KEY,
			[ctx.getHandler(), ctx.getClass()]
		);

		const req = ctx.switchToHttp().getRequest();

		const contentLength = parseInt(req.headers['content-length'] ?? '0');
		if (!contentLength) {
			throw new BadRequestException('Content-Length обязателен');
		}
		if (contentLength > requiredSize * 1024 * 1024) {
			throw new PayloadTooLargeException(`Максимум ${requiredSize} MB`);
		}

		const contentType = req.headers['content-type'] ?? '';
		if (!contentType.includes('multipart/form-data')) {
			throw new UnsupportedMediaTypeException(
				'Ожидается multipart/form-data'
			);
		}

		return true;
	}
}
