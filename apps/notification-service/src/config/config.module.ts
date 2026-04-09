import { createConfigModule } from 'libsV2/config';

import { notificationEnvSchema } from './env.schema';

export const ConfigModule = createConfigModule(
	notificationEnvSchema,
	'notification-service'
);
