import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Role } from 'prisma/generated/enums';
import type { ReqUser } from 'src/shared';

import { ROLES_KEY } from '../decorators/set-roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	public constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()]
		);

		if (!requiredRoles || requiredRoles.length === 0) return true;

		const req = context.switchToHttp().getRequest() as Request;
		const user = req.user as ReqUser;

		if (!user) throw new ForbiddenException('Доступ запрещён');

		if (!requiredRoles.includes(user.role))
			throw new ForbiddenException('Недостаточно прав');

		return true;
	}
}
