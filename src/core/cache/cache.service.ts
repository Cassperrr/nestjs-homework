import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import ms, { type StringValue } from 'ms';
import { pack, unpack } from 'msgpackr';
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

	// === Так как JSON.parse и JSON.stringify может давайть нагрузку при больших объемах данных и частых запросов, можно попробовать заменить на protobuf или msgpack (бинарка)
	public async set(key: string, data: string, ttl: number) {
		return this.redis.set(key, data, 'EX', ttl);
	}

	// msgpack
	public async setBuffers<T>(key: string, data: T, ttl: number) {
		return this.redis
			.pipeline()
			.set(key, pack(data))
			.expire(key, ttl)
			.exec();
	}

	public async get(key: string) {
		return this.redis.get(key);
	}

	public async getBuffer<T>(key: string): Promise<T | null> {
		const data = await this.redis.getBuffer(key);
		return data ? unpack(data) : null;
	}

	// === Инвалидацию кэша сделал через event emitter потому что вот эта херь сканит циклом, знаю что можно было бы вызвать синхронно, но захотел попробовать такой подход + не надо будет потом вспоминать почему метод без await ===
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
