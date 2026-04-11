import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@transaction-service/prisma/generated/client';
import { TxServiceEnv } from '@transaction-service/src/config';
import { PrismaFactoryModule } from 'libs/prisma';

@Module({
	imports: [
		PrismaFactoryModule.registerAsync(PrismaClient, {
			inject: [ConfigService],
			useFactory: (config: ConfigService<TxServiceEnv, true>) => ({
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
