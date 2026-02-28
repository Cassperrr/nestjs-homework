import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from 'prisma/generated/enums';

import { JwtGuard, RolesGuard } from '../guards';

import { SetRoles } from './set-roles.decorator';

export const Authorization = (...roles: Role[]) => {
	return applyDecorators(SetRoles(...roles), UseGuards(JwtGuard, RolesGuard));
};
