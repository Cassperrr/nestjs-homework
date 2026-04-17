import { SetMetadata } from '@nestjs/common';
import { Role } from 'shared';

export const ROLES_KEY = 'required_roles';

export const SetRoles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
