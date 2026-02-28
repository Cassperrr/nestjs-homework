import {
	createParamDecorator,
	type ExecutionContext,
	UnauthorizedException
} from '@nestjs/common';
import type { Request } from 'express';

export const Id = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
	const req = ctx.switchToHttp().getRequest() as Request;
	if (!req.user)
		throw new UnauthorizedException('Пользователь не авторизован');
	return req.user.id;
});
