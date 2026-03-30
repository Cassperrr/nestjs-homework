import { generalSchema } from '@libs/config';
import { z } from 'zod';

export const mailServiceEnvSchema = generalSchema.extend({
	RMQ_URL: z.string().nonempty(),
	MAIL_QUEUE: z.string().nonempty(),

	SMTP_HOST: z.string().nonempty(),
	SMTP_PORT: z.coerce.number().min(1).max(65535)
});

export type MailServiceEnv = z.infer<typeof mailServiceEnvSchema>;
