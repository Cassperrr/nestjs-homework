import {
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { AccountRepository, BalanceRepository } from 'src/core';

import { BalanceResponse } from './dto';

@Injectable()
export class BalanceService {
	private readonly logger = new Logger(BalanceService.name);

	public constructor(
		private readonly balanceRepo: BalanceRepository,
		private readonly accountRepo: AccountRepository
	) {}

	public async findBalance(accountId: string): Promise<BalanceResponse> {
		const account = await this.accountRepo.findBy({ id: accountId });

		if (!account || account.deletedAt)
			throw new UnauthorizedException('Аккаунт не существует');

		const balance = await this.balanceRepo.findBalance(account.id);

		if (!balance) throw new NotFoundException('Баланс не найден');

		return { balance: (balance.amount / 100n).toString() };
	}

	public async deposit() {}
}
