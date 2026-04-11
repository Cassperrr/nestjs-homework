import { createConfigModule } from '@libs/config';

import { mailServiceEnvSchema } from './env.schema';

export const ConfigModule = createConfigModule(
	mailServiceEnvSchema,
	'mail-service'
);
