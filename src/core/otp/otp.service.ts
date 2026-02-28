import {
	GoneException,
	HttpException,
	HttpStatus,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { createHash } from 'node:crypto';
import { generateCode } from 'patcode';
import { RedisService } from 'src/infra';
import { OtpKey } from 'src/shared';

@Injectable()
export class OtpService {
	public constructor(
		private readonly redis: RedisService,
		private readonly expireTtl: number,
		private readonly attemptsCount: number,
		private readonly cooldownTtl: number
	) {}

	private genOtpHash(code: string) {
		return createHash('sha256').update(code).digest('hex');
	}

	public async generate(id: string, key: OtpKey) {
		const codeKey = `otp:${key}:${id}`;
		const cooldownKey = `${codeKey}:cooldown`;

		const cooldown = await this.redis.get(cooldownKey);
		if (cooldown)
			throw new HttpException(
				'Подождите перед повторной отправкой',
				HttpStatus.TOO_MANY_REQUESTS
			);

		const code = generateCode();
		const hash = this.genOtpHash(code);

		await this.redis
			.multi()
			.hset(codeKey, {
				hash,
				attempts: 0
			})
			.expire(codeKey, this.expireTtl)
			.set(cooldownKey, 1, 'EX', this.cooldownTtl)
			.exec();

		return { code };
	}

	public async verify(id: string, code: string, key: OtpKey) {
		const codeKey = `otp:${key}:${id}`;
		const cooldownKey = `${codeKey}:cooldown`;

		const storedHash = await this.redis.hget(codeKey, 'hash');
		if (!storedHash) throw new GoneException('Код истек или не существует');

		const attempts = await this.redis.hincrby(codeKey, 'attempts', 1);
		if (attempts > this.attemptsCount) {
			await this.redis.del(codeKey);
			throw new HttpException(
				'Превышено количество попыток',
				HttpStatus.TOO_MANY_REQUESTS
			);
		}

		const incomingHash = this.genOtpHash(code);
		if (storedHash !== incomingHash)
			throw new UnauthorizedException(
				`Неверный код. Осталось попыток: ${this.attemptsCount - attempts}`
			);

		await this.redis.del(codeKey, cooldownKey);
	}
}
