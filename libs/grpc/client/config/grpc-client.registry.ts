import { PROTO_PATHS } from '@contracts';
import { ACCOUNT_PACKAGE_NAME } from 'contracts/grpc/gen/account';
import { AUTH_PACKAGE_NAME } from 'contracts/grpc/gen/auth';
import { AVATAR_PACKAGE_NAME } from 'contracts/grpc/gen/avatar';
import { BALANCE_PACKAGE_NAME } from 'contracts/grpc/gen/balance';
import { JOB_PACKAGE_NAME } from 'contracts/grpc/gen/job';
import { PROFILE_PACKAGE_NAME } from 'contracts/grpc/gen/profile';
import { TRANSACTION_PACKAGE_NAME } from 'contracts/grpc/gen/transaction';
import { USERS_PACKAGE_NAME } from 'contracts/grpc/gen/users';

export const GRPC_CLIENTS = {
	[AUTH_PACKAGE_NAME]: {
		package: AUTH_PACKAGE_NAME,
		protoPath: PROTO_PATHS.AUTH,
		env: {
			timeMs: 'USER_GRPC_PING_TIME_MS',
			timeoutMs: 'USER_GRPC_AWAIT_PONG_MS',
			deadlineSec: 'USER_GRPC_DEADLINE_SECONDS',
			url: 'USER_GRPC_URL'
		}
	},
	[ACCOUNT_PACKAGE_NAME]: {
		package: ACCOUNT_PACKAGE_NAME,
		protoPath: PROTO_PATHS.ACCOUNT,
		env: {
			timeMs: 'USER_GRPC_PING_TIME_MS',
			timeoutMs: 'USER_GRPC_AWAIT_PONG_MS',
			deadlineSec: 'USER_GRPC_DEADLINE_SECONDS',
			url: 'USER_GRPC_URL'
		}
	},
	[PROFILE_PACKAGE_NAME]: {
		package: PROFILE_PACKAGE_NAME,
		protoPath: PROTO_PATHS.PROFILE,
		env: {
			timeMs: 'USER_GRPC_PING_TIME_MS',
			timeoutMs: 'USER_GRPC_AWAIT_PONG_MS',
			deadlineSec: 'USER_GRPC_DEADLINE_SECONDS',
			url: 'USER_GRPC_URL'
		}
	},
	[AVATAR_PACKAGE_NAME]: {
		package: AVATAR_PACKAGE_NAME,
		protoPath: PROTO_PATHS.AVATAR,
		env: {
			timeMs: 'USER_GRPC_PING_TIME_MS',
			timeoutMs: 'USER_GRPC_AWAIT_PONG_MS',
			deadlineSec: 'USER_GRPC_DEADLINE_SECONDS',
			url: 'USER_GRPC_URL'
		}
	},
	[USERS_PACKAGE_NAME]: {
		package: USERS_PACKAGE_NAME,
		protoPath: PROTO_PATHS.USERS,
		env: {
			timeMs: 'USER_GRPC_PING_TIME_MS',
			timeoutMs: 'USER_GRPC_AWAIT_PONG_MS',
			deadlineSec: 'USER_GRPC_DEADLINE_SECONDS',
			url: 'USER_GRPC_URL'
		}
	},
	[BALANCE_PACKAGE_NAME]: {
		package: BALANCE_PACKAGE_NAME,
		protoPath: PROTO_PATHS.BALANCE,
		env: {
			timeMs: 'USER_GRPC_PING_TIME_MS',
			timeoutMs: 'USER_GRPC_AWAIT_PONG_MS',
			deadlineSec: 'USER_GRPC_DEADLINE_SECONDS',
			url: 'USER_GRPC_URL'
		}
	},
	[TRANSACTION_PACKAGE_NAME]: {
		package: TRANSACTION_PACKAGE_NAME,
		protoPath: PROTO_PATHS.TRANSACTION,
		env: {
			timeMs: 'TRANSACTION_GRPC_PING_TIME_MS',
			timeoutMs: 'TRANSACTION_GRPC_AWAIT_PONG_MS',
			deadlineSec: 'TRANSACTION_GRPC_DEADLINE_SECONDS',
			url: 'TRANSACTION_GRPC_URL'
		}
	},
	[JOB_PACKAGE_NAME]: {
		package: JOB_PACKAGE_NAME,
		protoPath: PROTO_PATHS.JOB,
		env: {
			timeMs: 'JOB_GRPC_PING_TIME_MS',
			timeoutMs: 'JOB_GRPC_AWAIT_PONG_MS',
			deadlineSec: 'JOB_GRPC_DEADLINE_SECONDS',
			url: 'JOB_GRPC_URL'
		}
	}
} as const;
