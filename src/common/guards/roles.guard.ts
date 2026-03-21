import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from 'prisma/generated/enums';
import type { IJwtPayload } from 'src/shared';

import { ROLES_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
	public constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()]
		);

		if (!requiredRoles || requiredRoles.length === 0) return true;

		const req = context.switchToHttp().getRequest<Request>();
		const user = req.user as IJwtPayload;

		if (!user) throw new ForbiddenException('Доступ запрещён');

		if (!requiredRoles.includes(user.role))
			throw new ForbiddenException('Недостаточно прав');

		return true;
	}
}
