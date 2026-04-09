import { generalSchema } from 'registries';
import { z } from 'zod';

export const jobServiceEnvSchema = generalSchema.extend({
	USER_ACCESS_TOKEN: z.string().nonempty(),
	JOB_ACCESS_TOKEN: z.string().nonempty(),

	REDIS_USER: z.string().nonempty(),
	REDIS_PASSWORD: z.string().nonempty(),
	REDIS_HOST: z.string().nonempty(),
	REDIS_PORT: z.coerce.number().min(1).max(65535),
	REDIS_INDEX: z.coerce.number().min(0)
});

export type JobServiceEnv = z.infer<typeof jobServiceEnvSchema>;
