import { generalSchema } from 'registries';
import { z } from 'zod';

export const gatewayEnvSchema = generalSchema.extend({
	HTTP_PORT: z.coerce.number().min(1).max(65535),
	COOKIE_DOMAIN: z.string().default('localhost'),

	GATEWAY_ACCESS_TOKEN: z.string().nonempty(),

	THROTTLER_TTL: z.coerce.number().min(1000),
	THROTTLER_LIMIT: z.coerce.number().min(1),

	JWT_SECRET: z.string().nonempty(),

	FAILURE_THRESHOLD: z.coerce.number().min(1),
	RESET_AFTER_MS: z.coerce.number().min(1000),
	PROXY_TIMEOUT_MS: z.coerce.number().min(1000)
});

export type GatewayEnv = z.infer<typeof gatewayEnvSchema>;
