import { createConfigModule } from '@libs/config';

import { gatewayEnvSchema } from './env.schema';

export const ConfigModule = createConfigModule(gatewayEnvSchema, 'gateway');
