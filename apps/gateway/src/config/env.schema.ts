import { generalSchema } from '@libs/config';
import { z } from 'zod';

export const gatewayEnvSchema = generalSchema.extend({
	HTTP_PORT: z.coerce.number().min(1).max(65535),
	COOKIE_DOMAIN: z.string().default('localhost'),

	THROTTLER_TTL: z.coerce.number().min(1000),
	THROTTLER_LIMIT: z.coerce.number().min(1),

	JWT_SECRET: z.string().nonempty()
});

export type GatewayEnv = z.infer<typeof gatewayEnvSchema>;
