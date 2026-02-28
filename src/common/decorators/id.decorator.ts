import {
	createParamDecorator,
	type ExecutionContext,
	UnauthorizedException
} from '@nestjs/common';
import type { Request } from 'express';
import type { ReqUser } from 'src/shared';

export const Id = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
	const req = ctx.switchToHttp().getRequest() as Request;
	const user = req.user as ReqUser;

	if (!user) throw new UnauthorizedException('Пользователь не авторизован');

	return user.id;
});
