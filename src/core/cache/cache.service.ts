import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import ms, { type StringValue } from 'ms';
import { EnvTypes } from 'src/config';
import { RedisService } from 'src/infra';

import { CACHE_EVENTS } from '../constants';

@Injectable()
export class CacheService {
	private readonly logger = new Logger(CacheService.name);
	private readonly cacheUsersTtl: StringValue;

	public constructor(
		private readonly redis: RedisService,
		private readonly configService: ConfigService<EnvTypes, true>
	) {
		this.cacheUsersTtl = configService.get('CACHE_USERS_TTL', {
			infer: true
		});

		this.logger.debug(`${CacheService.name} created`);
	}

	// Сделал чуть универсальнее потому что кэш может быть для разных струтктур
	public usersKeyOptions({
		username,
		cursor,
		limit
	}: {
		username?: string;
		cursor?: string;
		limit: number;
	}) {
		return {
			key: `cache:users:${username ?? 'all'}:cursor=${cursor ?? 'start'}:limit=${limit}`,
			ttl: ms(this.cacheUsersTtl) / 1000
		};
	}

	public async set(key: string, data: string, ttl: number) {
		return this.redis.set(key, data, 'EX', ttl);
	}

	public async get(key: string) {
		return this.redis.get(key);
	}

	public async invalidateByPattern(pattern: 'users') {
		let cursor = '0';
		do {
			const [nextCursor, keys] = await this.redis.scan(
				cursor,
				'MATCH',
				`cache:${pattern}:*`,
				'COUNT',
				100
			);
			cursor = nextCursor;
			if (keys.length) await this.redis.del(...keys);
		} while (cursor !== '0');
	}

	@OnEvent(CACHE_EVENTS.USERS_INVALIDATE)
	public async handleUsersInvalidate() {
		this.logger.debug('Инвалидация кэша users по событию');
		await this.invalidateByPattern('users');
	}
}
