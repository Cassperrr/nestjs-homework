import { X_GATEWAY_ACCESS_TOKEN } from 'shared';

// TODO возможно стоит перенести внутрь сервиса и перадвать динамически
export const TOKEN_VALIDATORS: Record<string, string> = {
	[X_GATEWAY_ACCESS_TOKEN]: 'GATEWAY_ACCESS_TOKEN'
};
