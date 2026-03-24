import { join } from 'path';

export const PROTO_PATHS = {
	AUTH: join(process.cwd(), 'contracts/proto/auth.proto'),
	ACCOUNT: join(process.cwd(), 'contracts/proto/account.proto')
} as const;
