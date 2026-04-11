import { generalSchema } from 'registries';
import { z } from 'zod';

export const notificationEnvSchema = generalSchema.extend({
	WSS_PORT: z.coerce.number().min(1).max(65535),

	JWT_SECRET: z.string().nonempty(),

	MONGO_URL: z.string().nonempty()
});

export type NotificationEnv = z.infer<typeof notificationEnvSchema>;
