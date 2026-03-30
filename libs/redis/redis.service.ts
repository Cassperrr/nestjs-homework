import {
	Inject,
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit
} from '@nestjs/common';
import Redis from 'ioredis';

import { REDIS_OPTIONS } from './constants';
import type { RedisModuleOptions } from './interfaces';

@Injectable()
export class RedisService
	extends Redis
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(RedisService.name);

	public constructor(@Inject(REDIS_OPTIONS) options: RedisModuleOptions) {
		super(options);
	}

	public async onModuleInit() {
		const start = Date.now();
		this.logger.log('Initializing Redis connection...');
		this.on('connect', () => this.logger.log('Redis connecting...'));
		this.on('ready', () =>
			this.logger.log(`Redis connected (time=${Date.now() - start}ms)`)
		);
		this.on('error', e =>
			this.logger.error('Redis error', { error: e.message ?? e })
		);
		this.on('close', () => this.logger.warn('Redis connection closed'));
		this.on('reconnecting', () => this.logger.log('Redis reconnecting...'));
		await this.connect();
	}

	public async onModuleDestroy() {
		this.logger.log('Closing Redis connection...');
		try {
			await this.quit();
			this.logger.log('Redis connection closed');
		} catch (e) {
			this.logger.error('Error closing Redis connection', {
				error: e instanceof Error ? e.message : String(e)
			});
		}
	}
}
