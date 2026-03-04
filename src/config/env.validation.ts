import ms, { type StringValue } from 'ms';
import { z } from 'zod';

export const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production']).default('development'),
	APP_PORT: z.coerce.number().min(1).max(65535).default(3000),
	COOKIE_DOMAIN: z.string().default('localhost'),

	POSTGRES_USER: z.string().nonempty(),
	POSTGRES_PASSWORD: z.string().nonempty(),
	POSTGRES_PORT: z.coerce.number().min(1).max(65535).default(5432),
	POSTGRES_DB: z.string().nonempty(),
	POSTGRES_HOST: z.string().default('127.0.0.1'),

	REDIS_USER: z.string().nonempty(),
	REDIS_PASSWORD: z.string().nonempty(),
	REDIS_HOST: z.string().default('127.0.0.1'),
	REDIS_PORT: z.coerce.number().min(1).max(65535).default(5432),

	THROTTLER_TTL: z.coerce.number().min(1000).default(10000),
	THROTTLER_LIMIT: z.coerce.number().min(1).default(20),

	OTP_CODE_TTL: z.coerce.number().min(100).default(300),
	OTP_ATTEMPTS_COUNT: z.coerce.number().min(1).default(3),
	COOLDOWN_TTL: z.coerce.number().positive().default(60),

	HASH_PEPPER: z.string().nonempty(),
	MEMORY_COST: z.coerce.number().positive().default(65536),
	TIME_COST: z.coerce.number().positive().default(3),
	PARALLELISM: z.coerce.number().positive().default(4),

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
		.default('7d')
});

export function validate(config: Record<string, unknown>) {
	const result = envSchema.safeParse(config);

	if (!result.success) {
		throw new Error(
			`ENV validation error:\n${result.error.issues
				.map(i => `${i.path}: ${i.message}`)
				.join('\n')}`
		);
	}

	return result.data;
}

export type EnvTypes = z.infer<typeof envSchema>;
