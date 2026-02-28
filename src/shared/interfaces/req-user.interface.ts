import { Role } from 'prisma/generated/enums';

export interface ReqUser {
	id: string;
	role: Role;
}
