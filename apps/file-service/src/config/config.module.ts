import { createConfigModule } from '@libs/config';

import { fileServiceEnvSchema } from './env.schema';

export const ConfigModule = createConfigModule(
	fileServiceEnvSchema,
	'file-service'
);
