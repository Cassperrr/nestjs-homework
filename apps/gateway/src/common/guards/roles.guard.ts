import {
	type CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { JwtPayload } from 'shared';
import { Role } from 'shared/enums';

import { ROLES_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
	public constructor(private readonly reflector: Reflector) {}

	canActivate(ctx: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
			ROLES_KEY,
			[ctx.getHandler(), ctx.getClass()]
		);

		if (!requiredRoles || requiredRoles.length === 0) return true;

		const req = ctx.switchToHttp().getRequest<Request>();
		const user = req.user as JwtPayload;

		if (!user) throw new ForbiddenException('Доступ запрещён');

		if (!requiredRoles.includes(user.role))
			throw new ForbiddenException('Недостаточно прав');

		return true;
	}
}
