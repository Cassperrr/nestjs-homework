import {
	Logger,
	type OnModuleDestroy,
	type OnModuleInit
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

type PrismaClientClass = new (args: { adapter: PrismaPg }) => {
	$connect(): Promise<void>;
	$disconnect(): Promise<void>;
	$executeRawUnsafe(query: string): Promise<unknown>;
};

type AbstractPrismaInstance = {
	onModuleInit(): Promise<void>;
	onModuleDestroy(): Promise<void>;
	logger: Logger;
};

export function AbstractPrismaService<TClient extends PrismaClientClass>(
	Client: TClient
) {
	// @ts-ignore
	class AbstractPrisma
		extends Client
		implements OnModuleInit, OnModuleDestroy
	{
		public readonly logger = new Logger('PrismaService');

		public constructor(adapter: PrismaPg) {
			super({ adapter });
			this.logger.debug(`PrismaService created`);
		}

		public async onModuleInit() {
			const start = Date.now();
			this.logger.log('Connecting to database...');
			try {
				await this.$connect();
				await this.$executeRawUnsafe('SELECT 1');
				this.logger.log(
					`Database connection established (time=${Date.now() - start}ms)`
				);
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

	return AbstractPrisma as unknown as new (
		adapter: PrismaPg
	) => InstanceType<typeof AbstractPrisma> & AbstractPrismaInstance;
}
