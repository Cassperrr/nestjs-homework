import { createConfigModule } from 'libsV2/config';

import { jobServiceEnvSchema } from './env.schema';

export const ConfigModule = createConfigModule(
	jobServiceEnvSchema,
	'job-service'
);
