import {
	Injectable,
	Logger,
	type OnModuleDestroy,
	type OnModuleInit
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import type { EnvTypes } from 'src/config';

@Injectable()
export class RedisService
	extends Redis
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(RedisService.name);

	public constructor(
		private readonly configService: ConfigService<EnvTypes, true>
	) {
		super({
			username: configService.get('REDIS_USER', { infer: true }),
			password: configService.get('REDIS_PASSWORD', { infer: true }),
			host: configService.get('REDIS_HOST', { infer: true }),
			port: configService.get('REDIS_PORT', { infer: true }),
			lazyConnect: true,
			maxRetriesPerRequest: 5,
			enableOfflineQueue: true
		});
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
