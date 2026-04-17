import { Injectable } from '@nestjs/common';
import type { StringMessage } from 'contracts/grpc/gen/shared';

import { BalanceResetService } from './jobs';

@Injectable()
export class JobService {
	public constructor(
		private readonly balanceResetService: BalanceResetService
	) {}

	public async putResetBalanceJob(): Promise<StringMessage> {
		await this.balanceResetService.enqueue();
		return { message: 'ok' };
	}

	public async startResetBalanceJob(): Promise<StringMessage> {
		this.balanceResetService.startCron();
		return { message: 'ok' };
	}

	public async stopResetBalanceJob(): Promise<StringMessage> {
		this.balanceResetService.stopCron();
		return { message: 'ok' };
	}
}
