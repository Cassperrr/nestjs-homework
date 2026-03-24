import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from 'shared';

import { JwtGuard, RolesGuard } from '../../guards';

import { SetRoles } from './set-roles.decorator';

export const Protected = (...roles: Role[]) => {
	return applyDecorators(SetRoles(...roles), UseGuards(JwtGuard, RolesGuard));
};
