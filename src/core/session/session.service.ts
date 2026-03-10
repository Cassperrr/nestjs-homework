import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ms, { type StringValue } from 'ms';
import { EnvTypes } from 'src/config';
import { RedisService } from 'src/infra';

@Injectable()
export class SessionService {
	private readonly logger = new Logger(SessionService.name);
	private readonly sessionTtl: StringValue;

	public constructor(
		private readonly redis: RedisService,
		private readonly configService: ConfigService<EnvTypes, true>
	) {
		this.sessionTtl = configService.get('JWT_REFRESH_TOKEN_TTL', {
			infer: true
		});

		this.logger.debug(`${SessionService.name} created`);
	}

	public async set(id: string, refreshToken: string) {
		const ttlSeconds = ms(this.sessionTtl) / 1000;
		return this.redis.set(`refresh:${id}`, refreshToken, 'EX', ttlSeconds);
	}

	public async get(id: string) {
		return this.redis.get(`refresh:${id}`);
	}

	public async delete(id: string) {
		return this.redis.del(`refresh:${id}`);
	}
}
