import { join } from 'path';

export const PROTO_PATHS = {
	AUTH: join(process.cwd(), 'contracts/proto/auth.proto'),
	ACCOUNT: join(process.cwd(), 'contracts/proto/account.proto'),
	PROFILE: join(process.cwd(), 'contracts/proto/profile.proto'),
	AVATAR: join(process.cwd(), 'contracts/proto/avatar.proto'),
	USERS: join(process.cwd(), 'contracts/proto/users.proto'),
	BALANCE: join(process.cwd(), 'contracts/proto/balance.proto'),
	TRANSACTION: join(process.cwd(), 'contracts/proto/transaction.proto'),
	JOB: join(process.cwd(), 'contracts/proto/job.proto')
} as const;
