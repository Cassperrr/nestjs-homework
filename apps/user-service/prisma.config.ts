import dotenv from 'dotenv';
import { resolve } from 'path';
import { defineConfig, env } from 'prisma/config';

dotenv.config({
	path: resolve(__dirname, '.env.development.local')
});

export default defineConfig({
	schema: resolve(__dirname, 'prisma/schema.prisma'),
	migrations: {
		path: resolve(__dirname, 'prisma/migrations')
	},
	datasource: {
		url: env('DATABASE_URI')
	}
});
