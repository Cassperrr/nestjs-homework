import { Injectable } from '@nestjs/common';
import ms, { type StringValue } from 'ms';
import { RedisService } from 'src/infra';

@Injectable()
export class SessionService {
	public constructor(
		private readonly redis: RedisService,
		private readonly sessionTtl: StringValue
	) {}

	public async set(id: string, refreshToken: string) {
		const ttlSeconds = ms(this.sessionTtl) / 1000;
		await this.redis.set(`refresh:${id}`, refreshToken, 'EX', ttlSeconds);
	}

	public async get(id: string) {
		return this.redis.get(`refresh:${id}`);
	}

	public async delete(id: string) {
		await this.redis.del(`refresh:${id}`);
	}
}
