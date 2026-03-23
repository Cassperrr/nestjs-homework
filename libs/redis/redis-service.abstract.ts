import {
	Logger,
	type OnModuleDestroy,
	type OnModuleInit
} from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

export abstract class AbstractRedisService
	extends Redis
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger('RedisService');

	public constructor(options: RedisOptions) {
		super(options);
		this.logger.debug(`RedisService created`);
	}

	public async onModuleInit() {
		const start = Date.now();

		this.logger.log('Initializing Redis connection...');

		this.on('connect', () => {
			this.logger.log('Redis connecting...');
		});
		this.on('ready', () => {
			const ms = Date.now() - start;
			this.logger.log(`Redis connected (time=${ms}ms)`);
		});
		this.on('error', e => {
			this.logger.error('Redis error', {
				error: e.message ?? e
			});
		});
		this.on('close', () => {
			this.logger.warn('Redis connection closed');
		});
		this.on('reconnecting', () => {
			this.logger.log('Redis reconnecting...');
		});

		await this.connect();
	}

	public async onModuleDestroy() {
		this.logger.log('Closing Redis connection...');

		try {
			await this.quit();
			this.logger.log('Redis connection closed');
		} catch (e) {
			this.logger.error('Error closing error connection', {
				error: e instanceof Error ? e.message : String(e)
			});
		}
	}
}
