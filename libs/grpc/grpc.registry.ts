import { PROTO_PATHS } from '@contracts';

export const GRPC_CLIENTS = {
	AUTH_PACKAGE: {
		package: 'auth',
		protoPath: PROTO_PATHS.AUTH,
		env: 'USER_GRPC_URL'
	}
} as const;
