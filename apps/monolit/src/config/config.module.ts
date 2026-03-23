import { ConfigModule } from '@nestjs/config';

import { validate } from './env.validation';

export const AppConfigModule = ConfigModule.forRoot({
	isGlobal: true,
	envFilePath: [
		`.env.${process.env.NODE_ENV}.local`,
		`.env.${process.env.NODE_ENV}`,
		`.env`
	],
	validate
});
