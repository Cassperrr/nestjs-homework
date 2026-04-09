import { createConfigModule } from 'libsV2/config';

import { gatewayEnvSchema } from './env.schema';

export const ConfigModule = createConfigModule(gatewayEnvSchema, 'gateway');
