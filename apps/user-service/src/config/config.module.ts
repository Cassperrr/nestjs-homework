import { createConfigModule } from '@libs/config';

import { userServiceEnvSchema } from './env.schema';

export const ConfigModule = createConfigModule(
	userServiceEnvSchema,
	'user-service'
);
