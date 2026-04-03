import { createConfigModule } from '@libs/config';

import { txServiceEnvSchema } from './env.schema';

export const ConfigModule = createConfigModule(
	txServiceEnvSchema,
	'transaction-service'
);
