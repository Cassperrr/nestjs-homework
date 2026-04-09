import { createConfigModule } from 'libsV2/config';

import { fileServiceEnvSchema } from './env.schema';

export const ConfigModule = createConfigModule(
	fileServiceEnvSchema,
	'file-service'
);
