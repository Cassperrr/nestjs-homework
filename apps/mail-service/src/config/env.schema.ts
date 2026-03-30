import { generalSchema } from '@libs/config';
import { z } from 'zod';

export const mailServiceEnvSchema = generalSchema.extend({
	RMQ_URL: z.string().nonempty(),
	MAIL_QUEUE: z.string().nonempty()
});

export type MailServiceEnv = z.infer<typeof mailServiceEnvSchema>;
