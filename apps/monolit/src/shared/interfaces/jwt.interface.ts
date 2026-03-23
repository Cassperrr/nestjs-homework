import { Role } from 'prisma/generated/enums';

export interface IJwtPayload {
	id: string;
	role: Role;
}
