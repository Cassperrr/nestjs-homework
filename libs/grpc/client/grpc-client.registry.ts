import { PROTO_PATHS } from '@contracts';
import { ACCOUNT_PACKAGE_NAME } from 'contracts/gen/account';
import { AUTH_PACKAGE_NAME } from 'contracts/gen/auth';
import { PROFILE_PACKAGE_NAME } from 'contracts/gen/profile';

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
	}
} as const;
