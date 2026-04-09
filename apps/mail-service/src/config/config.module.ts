import { createConfigModule } from 'libsV2/config';

import { mailServiceEnvSchema } from './env.schema';

export const ConfigModule = createConfigModule(
	mailServiceEnvSchema,
	'mail-service'
);
