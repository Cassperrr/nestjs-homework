import { join } from 'path';

export const PROTO_PATHS = {
	AUTH: join(process.cwd(), 'contracts/grpc/proto/auth.proto'),
	ACCOUNT: join(process.cwd(), 'contracts/grpc/proto/account.proto'),
	PROFILE: join(process.cwd(), 'contracts/grpc/proto/profile.proto'),
	AVATAR: join(process.cwd(), 'contracts/grpc/proto/avatar.proto'),
	USERS: join(process.cwd(), 'contracts/grpc/proto/users.proto'),
	BALANCE: join(process.cwd(), 'contracts/grpc/proto/balance.proto'),
	TRANSACTION: join(process.cwd(), 'contracts/grpc/proto/transaction.proto'),
	JOB: join(process.cwd(), 'contracts/grpc/proto/job.proto')
} as const;
