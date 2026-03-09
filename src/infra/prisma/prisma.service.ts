import {
	Injectable,
	Logger,
	type OnModuleDestroy,
	type OnModuleInit
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'prisma/generated/client';
import type { EnvTypes } from 'src/config';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(PrismaService.name);

	public constructor(configService: ConfigService<EnvTypes, true>) {
		const adapter = new PrismaPg({
			user: configService.get('POSTGRES_USER', { infer: true }),
			password: configService.get('POSTGRES_PASSWORD', { infer: true }),
			host: configService.get('POSTGRES_HOST', { infer: true }),
			port: configService.get('POSTGRES_PORT', { infer: true }),
			database: configService.get('POSTGRES_DB', { infer: true })
		});

		super({ adapter });

		this.logger.debug(`${PrismaService.name} created`);
	}

	public async onModuleInit() {
		const start = Date.now();

		this.logger.log('Connecting to database...');

		try {
			await this.$connect();
			await this.$executeRawUnsafe('SELECT 1');

			const ms = Date.now() - start;

			this.logger.log(`Database connection established (time=${ms}ms)`);
		} catch (e) {
			this.logger.error('Failed connect to database', e);

			throw e;
		}
	}

	public async onModuleDestroy() {
		this.logger.log('Disconnecting from database...');

		try {
			await this.$disconnect();

			this.logger.log('Database connection close');
		} catch (e) {
			this.logger.error('Failed disconnect from database', e);

			throw e;
		}
	}
}
