import { createConfigModule } from 'libsV2/config';

import { userServiceEnvSchema } from './env.schema';

export const ConfigModule = createConfigModule(
	userServiceEnvSchema,
	'user-service'
);
