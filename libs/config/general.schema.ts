import { z } from 'zod';

export const generalSchema = z.object({
	NODE_ENV: z.enum(['development', 'production']).default('development'),

	USER_GRPC_HOST: z.string().nonempty(),
	USER_GRPC_PORT: z.coerce.number().min(1).max(65535),
	USER_GRPC_URL: z.string().nonempty(),
	USER_GRPC_PING_TIME_MS: z.coerce.number().min(1000),
	USER_GRPC_AWAIT_PONG_MS: z.coerce.number().min(1000),
	USER_GRPC_DEADLINE_SECONDS: z.coerce.number().min(1),

	JOB_GRPC_HOST: z.string().nonempty(),
	JOB_GRPC_PORT: z.coerce.number().min(1).max(65535),
	JOB_GRPC_URL: z.string().nonempty(),
	JOB_GRPC_PING_TIME_MS: z.coerce.number().min(1000),
	JOB_GRPC_AWAIT_PONG_MS: z.coerce.number().min(1000),
	JOB_GRPC_DEADLINE_SECONDS: z.coerce.number().min(1)
});
