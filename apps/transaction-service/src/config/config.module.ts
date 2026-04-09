import { createConfigModule } from 'libsV2/config';

import { txServiceEnvSchema } from './env.schema';

export const ConfigModule = createConfigModule(
	txServiceEnvSchema,
	'transaction-service'
);
