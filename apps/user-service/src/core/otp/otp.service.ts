import { GrpcStatus } from '@libs/grpc';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { UserServiceEnv } from '@user-service/src/config';
import { RedisService } from '@user-service/src/infra';
import { createHash } from 'node:crypto';
import { generateCode } from 'patcode';
import type { OtpKey } from 'shared';

@Injectable()
export class OtpService {
	private readonly logger = new Logger(OtpService.name);

	private readonly expireTtl: number;
	private readonly attemptsCount: number;
	private readonly cooldownTtl: number;
	public constructor(
		private readonly redis: RedisService,
		private readonly configService: ConfigService<UserServiceEnv, true>
	) {
		this.expireTtl = configService.get('OTP_CODE_TTL', {
			infer: true
		});
		this.attemptsCount = configService.get('OTP_ATTEMPTS_COUNT', {
			infer: true
		});
		this.cooldownTtl = configService.get('COOLDOWN_TTL', {
			infer: true
		});

		this.logger.debug(`${OtpService.name} created`);
	}

	private genOtpHash(code: string) {
		return createHash('sha256').update(code).digest('hex');
	}

	public async generate(id: string, key: OtpKey) {
		const codeKey = `otp:${key}:${id}`;
		const cooldownKey = `${codeKey}:cooldown`;

		const cooldown = await this.redis.get(cooldownKey);
		if (cooldown)
			throw new RpcException({
				code: GrpcStatus.RESOURCE_EXHAUSTED,
				details: 'Подождите перед повторной отправкой'
			});

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
		if (!storedHash)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Код истек или не существует'
			});

		const attempts = await this.redis.hincrby(codeKey, 'attempts', 1);
		if (attempts > this.attemptsCount) {
			await this.redis.del(codeKey);
			throw new RpcException({
				code: GrpcStatus.RESOURCE_EXHAUSTED,
				details: 'Подождите перед повторной отправкой'
			});
		}

		const incomingHash = this.genOtpHash(code);
		if (storedHash !== incomingHash)
			throw new RpcException({
				code: GrpcStatus.UNAUTHENTICATED,
				details: `Неверный код. Осталось попыток: ${this.attemptsCount - attempts}`
			});

		await this.redis.del(codeKey, cooldownKey);
	}
}
