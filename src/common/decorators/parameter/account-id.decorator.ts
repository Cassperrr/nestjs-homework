import {
	createParamDecorator,
	type ExecutionContext,
	UnauthorizedException
} from '@nestjs/common';
import type { Request } from 'express';
import type { IJwtPayload } from 'src/shared';

export const AccountId = createParamDecorator(
	(_: unknown, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest<Request>();
		const user = req.user as IJwtPayload;

		if (!user)
			throw new UnauthorizedException('Пользователь не авторизован');

		return user.id;
	}
);
