import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'apps/user-service/prisma/generated/client';
import { AbstractPrismaService } from 'libs/prisma';

import { UserServiceEnv } from '../../config';

@Injectable()
export class PrismaService extends AbstractPrismaService(PrismaClient) {
	public constructor(configService: ConfigService<UserServiceEnv, true>) {
		super(
			new PrismaPg({
				user: configService.get('DATABASE_USER', { infer: true }),
				password: configService.get('DATABASE_PASSWORD', {
					infer: true
				}),
				host: configService.get('DATABASE_HOST', { infer: true }),
				port: configService.get('DATABASE_PORT', { infer: true }),
				database: configService.get('DATABASE_NAME', {
					infer: true
				})
			})
		);
	}
}
