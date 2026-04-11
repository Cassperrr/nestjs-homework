import { GRPC_CLIENTS } from 'registries';

export const createClientToken = (token: keyof typeof GRPC_CLIENTS) =>
	`GRPC_CLIENT_${token}`;
