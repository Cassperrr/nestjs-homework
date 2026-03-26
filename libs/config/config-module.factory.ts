import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import z from 'zod';

import { createValidate } from './env.validation';

export function createConfigModule<T extends z.ZodTypeAny>(
	schema: T,
	appName: string
) {
	return ConfigModule.forRoot({
		isGlobal: true,
		envFilePath: [
			// env отдельных сервисов
			join(
				process.cwd(),
				'apps',
				appName,
				`.env.${process.env.NODE_ENV}.local`
			),
			join(
				process.cwd(),
				'apps',
				appName,
				`.env.${process.env.NODE_ENV}`
			),
			join(process.cwd(), 'apps', appName, `.env`),

			// общие env
			join(process.cwd(), `.env.${process.env.NODE_ENV}.local`),
			join(process.cwd(), `.env.${process.env.NODE_ENV}`),
			join(process.cwd(), `.env`)
		],
		validate: createValidate(schema)
	});
}
