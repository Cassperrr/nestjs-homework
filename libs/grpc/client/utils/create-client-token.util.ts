import { GRPC_CLIENTS } from '../config';
import { GRPC_CLIENT_PREFIX } from '../constants';

export const createClientToken = (token: keyof typeof GRPC_CLIENTS) =>
	`${GRPC_CLIENT_PREFIX}_${token}`;
