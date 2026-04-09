import ms, { type StringValue } from 'ms';
import { generalSchema } from 'registries';
import { z } from 'zod';

export const userServiceEnvSchema = generalSchema.extend({
	USER_ACCESS_TOKEN: z.string().nonempty(),

	GATEWAY_ACCESS_TOKEN: z.string().nonempty(),
	JOB_ACCESS_TOKEN: z.string().nonempty(),
	FILE_ACCESS_TOKEN: z.string().nonempty(),
	TX_ACCESS_TOKEN: z.string().nonempty(),

	DATABASE_USER: z.string().nonempty(),
	DATABASE_PASSWORD: z.string().nonempty(),
	DATABASE_PORT: z.coerce.number().min(1).max(65535),
	DATABASE_NAME: z.string().nonempty(),
	DATABASE_HOST: z.string().nonempty(),

	REDIS_USER: z.string().nonempty(),
	REDIS_PASSWORD: z.string().nonempty(),
	REDIS_HOST: z.string().nonempty(),
	REDIS_PORT: z.coerce.number().min(1).max(65535),
	REDIS_INDEX: z.coerce.number().min(0),

	MINIO_ENDPOINT: z.string().nonempty(),
	MINIO_ACCESS_KEY: z.string().nonempty(),
	MINIO_SECRET_KEY: z.string().nonempty(),
	MINIO_REGION: z.string().nonempty(),
	MINIO_BUCKET_NAME: z.string().nonempty(),

	MAIL_QUEUE: z.string().nonempty(),

	OTP_CODE_TTL: z.coerce.number().min(100),
	OTP_ATTEMPTS_COUNT: z.coerce.number().min(1),
	COOLDOWN_TTL: z.coerce.number().positive().min(30),

	HASH_PEPPER: z.string().nonempty(),
	MEMORY_COST: z.coerce.number().positive().default(65536),
	TIME_COST: z.coerce.number().positive().default(3),
	PARALLELISM: z.coerce.number().positive().default(4),

	MAX_AVATARS_FOR_PROFILE: z.coerce.number().positive().min(1),

	JWT_SECRET: z.string().nonempty(),
	JWT_ACCESS_TOKEN_TTL: z
		.custom<StringValue>(
			val => typeof val === 'string' && ms(val as StringValue) > 0
		)
		.default('1h'),
	JWT_REFRESH_TOKEN_TTL: z
		.custom<StringValue>(
			val => typeof val === 'string' && ms(val as StringValue) > 0
		)
		.default('7d'),

	CACHE_USERS_TTL: z
		.custom<StringValue>(
			val => typeof val === 'string' && ms(val as StringValue) > 0
		)
		.default('30s')
});

export type UserServiceEnv = z.infer<typeof userServiceEnvSchema>;
