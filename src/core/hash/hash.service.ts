import { Injectable } from '@nestjs/common';
import argon2 from 'argon2';

@Injectable()
export class HashService {
	public constructor(
		private readonly pepper: string,
		private readonly memoryCost: number,
		private readonly timeCost: number,
		private readonly parallelism: number
	) {}

	async hash(password: string): Promise<string> {
		return argon2.hash(password + this.pepper, {
			type: argon2.argon2id,
			memoryCost: this.memoryCost,
			timeCost: this.timeCost,
			parallelism: this.parallelism
		});
	}

	async verify(hash: string, password: string): Promise<boolean> {
		return argon2.verify(hash, password + this.pepper);
	}
}
