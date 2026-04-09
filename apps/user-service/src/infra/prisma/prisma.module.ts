import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { UserServiceEnv } from '@user-service/src/config';
import { PrismaClient } from 'apps/user-service/prisma/generated/client';
import { PrismaFactoryModule } from 'libsV2/prisma';

@Module({
	imports: [
		PrismaFactoryModule.registerAsync(PrismaClient, {
			inject: [ConfigService],
			useFactory: (config: ConfigService<UserServiceEnv, true>) => ({
				adapter: new PrismaPg({
					user: config.get('DATABASE_USER', { infer: true }),
					password: config.get('DATABASE_PASSWORD', {
						infer: true
					}),
					host: config.get('DATABASE_HOST', { infer: true }),
					port: config.get('DATABASE_PORT', { infer: true }),
					database: config.get('DATABASE_NAME', {
						infer: true
					})
				})
			})
		})
	]
})
export class PrismaModule {}
