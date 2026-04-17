import { createConfigModule } from '@libs/config';

import { notificationEnvSchema } from './env.schema';

export const ConfigModule = createConfigModule(
	notificationEnvSchema,
	'notification-service'
);
