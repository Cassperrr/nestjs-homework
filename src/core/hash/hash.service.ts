import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import argon2 from 'argon2';
import { EnvTypes } from 'src/config';

@Injectable()
export class HashService {
	private readonly logger = new Logger(HashService.name);

	private readonly pepper: string;
	private readonly memoryCost: number;
	private readonly timeCost: number;
	private readonly parallelism: number;
	public constructor(
		private readonly configService: ConfigService<EnvTypes, true>
	) {
		this.pepper = configService.get('HASH_PEPPER', {
			infer: true
		});
		this.memoryCost = configService.get('MEMORY_COST', {
			infer: true
		});
		this.timeCost = configService.get('TIME_COST', {
			infer: true
		});
		this.parallelism = configService.get('PARALLELISM', {
			infer: true
		});

		this.logger.debug(`${HashService.name} created`);
	}

	public async hash(password: string): Promise<string> {
		return argon2.hash(password + this.pepper, {
			type: argon2.argon2id,
			memoryCost: this.memoryCost,
			timeCost: this.timeCost,
			parallelism: this.parallelism
		});
	}

	public async verify(hash: string, password: string): Promise<boolean> {
		return argon2.verify(hash, password + this.pepper);
	}
}
