import { generalSchema } from '@libs/config';
import { z } from 'zod';

export const fileServiceEnvSchema = generalSchema.extend({
	USER_FILE_API_TOKEN: z.string().nonempty(),

	MINIO_ENDPOINT: z.string().nonempty(),
	MINIO_ACCESS_KEY: z.string().nonempty(),
	MINIO_SECRET_KEY: z.string().nonempty(),
	MINIO_REGION: z.string().nonempty(),
	MINIO_BUCKET_NAME: z.string().nonempty(),

	AVATAR_ALLOWED_TYPES: z.string().nonempty().default('jpeg|png')
});

export type FileServiceEnv = z.infer<typeof fileServiceEnvSchema>;
