import { Role } from 'shared';

export interface JwtPayload {
	id: string;
	role: Role;
}
