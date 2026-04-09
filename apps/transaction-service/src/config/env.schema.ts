import { generalSchema } from 'registries';
import { z } from 'zod';

export const txServiceEnvSchema = generalSchema.extend({
	HTTP_PORT: z.coerce.number().min(1).max(65535),
	TRUST_PROXY_NUMBER: z.coerce.number().min(1),

	TX_ACCESS_TOKEN: z.string().nonempty(),
	GATEWAY_ACCESS_TOKEN: z.string().nonempty(),

	DATABASE_USER: z.string().nonempty(),
	DATABASE_PASSWORD: z.string().nonempty(),
	DATABASE_PORT: z.coerce.number().min(1).max(65535),
	DATABASE_NAME: z.string().nonempty(),
	DATABASE_HOST: z.string().nonempty(),

	YOOKASSA_SHOP_ID: z.string().nonempty(),
	YOOKASSA_SECRET_KEY: z.string().nonempty(),

	POLL_INTERVAL_MS: z.coerce.number().min(1000),
	BATCH_SIZE: z.coerce.number().min(1),
	MAX_RETRY: z.coerce.number().min(0)
});

export type TxServiceEnv = z.infer<typeof txServiceEnvSchema>;
