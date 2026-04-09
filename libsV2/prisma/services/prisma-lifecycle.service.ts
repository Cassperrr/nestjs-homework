import {
	Inject,
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit
} from '@nestjs/common';

import { PRISMA_CLIENT_TOKEN } from '../constants';
import type { PrismaClientLike } from '../interfaces';

/**
 * Сервис отвечающий за жизненный цикл Prisma Module
 */
@Injectable()
export class PrismaLifecycleService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(PrismaLifecycleService.name);

	constructor(
		@Inject(PRISMA_CLIENT_TOKEN)
		private readonly client: PrismaClientLike
	) {}

	async onModuleInit() {
		const start = Date.now();
		this.logger.log('Connecting to database...');
		try {
			await this.client.$connect();
			await this.client.$executeRawUnsafe('SELECT 1');
			this.logger.log(
				`Database connection established (time=${Date.now() - start}ms)`
			);
		} catch (e) {
			this.logger.error('Failed connect to database', e);
			throw e;
		}
	}

	async onModuleDestroy() {
		this.logger.log('Disconnecting from database...');
		try {
			await this.client.$disconnect();
			this.logger.log('Database connection closed');
		} catch (e) {
			this.logger.error('Failed disconnect from database', e);
			throw e;
		}
	}
}
