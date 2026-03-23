import { z } from 'zod';

export const generalSchema = z.object({
	NODE_ENV: z.enum(['development', 'production']).default('development'),

	USER_GRPC_HOST: z.string().nonempty(),
	USER_GRPC_PORT: z.coerce.number().min(1).max(65535),
	USER_GRPC_URL: z.string().nonempty()
});
