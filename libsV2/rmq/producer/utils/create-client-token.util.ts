import { RMQ_CLIENTS } from 'registries';

export const createClientToken = (token: keyof typeof RMQ_CLIENTS) =>
	`RMQ_CLIENT_${token}`;
