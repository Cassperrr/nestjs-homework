import { Role } from 'prisma/generated/enums';

export interface JwtPayload {
	id: string;
	role: Role;
}
