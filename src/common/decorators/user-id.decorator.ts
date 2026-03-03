import {
	createParamDecorator,
	type ExecutionContext,
	UnauthorizedException
} from '@nestjs/common';
import type { Request } from 'express';
import type { JwtPayload } from 'src/shared';

export const UserId = createParamDecorator(
	(_: unknown, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest() as Request;
		const user = req.user as JwtPayload;

		if (!user)
			throw new UnauthorizedException('Пользователь не авторизован');

		return user.id;
	}
);
