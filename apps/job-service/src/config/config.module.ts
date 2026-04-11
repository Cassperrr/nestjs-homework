import { createConfigModule } from '@libs/config';

import { jobServiceEnvSchema } from './env.schema';

export const ConfigModule = createConfigModule(
	jobServiceEnvSchema,
	'job-service'
);
