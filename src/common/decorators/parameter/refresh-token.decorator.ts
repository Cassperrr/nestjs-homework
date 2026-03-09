import {
	createParamDecorator,
	ExecutionContext,
	UnauthorizedException
} from '@nestjs/common';
import type { Request } from 'express';

export const RefreshToken = createParamDecorator(
	(_: unknown, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest<Request>();

		const refreshToken = req.cookies['refreshToken'] as string;
		if (!refreshToken)
			throw new UnauthorizedException('Refresh токен не найден');

		return refreshToken;
	}
);
