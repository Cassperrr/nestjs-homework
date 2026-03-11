import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { TransactionType } from 'prisma/generated/enums';
import { TransactionException } from 'src/common';
import { AccountRepository, BalanceRepository } from 'src/core';
import 'src/shared/extensions/bigint.extension';

import {
	BalanceResponse,
	DepositAmountRequest,
	DepositAmountResponse,
	TransferAmountRequest,
	TransferAmountResponse,
	WithdrawalAmountRequest,
	WithdrawalAmountResponse
} from './dto';

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

		if (!balance || balance.blockedAt)
			throw new NotFoundException('Баланс не найден');

		return { balance: balance.amount.toDollars() };
	}

	public async deposit(
		accountId: string,
		idempotencyKey: string,
		dto: DepositAmountRequest
	): Promise<DepositAmountResponse> {
		const account = await this.accountRepo.findBy({ id: accountId });

		if (!account || account.deletedAt)
			throw new UnauthorizedException('Аккаунт не существует');

		const balance = await this.balanceRepo.findBalance(account.id);

		if (!balance || balance.blockedAt)
			throw new NotFoundException('Баланс не найден');

		const { amountInCents, amount } = dto;

		const tx = await this.balanceRepo
			.txDeposit(accountId, idempotencyKey, amountInCents)
			.catch(error => {
				this.logger.warn(
					`[${account.id}] [${account.role}] [${TransactionType.DEPOSIT}] FAIL ${amount}$: ${error}`
				);
				throw new TransactionException(
					error instanceof Error ? error.message : String(error)
				);
			});

		this.logger.log(
			`[${account.id}] [${account.role}] [${TransactionType.DEPOSIT}] SUCCESS ${tx.amount.toDollars()}$`
		);

		return {
			...tx,
			amount: tx.amount.toDollars()
		};
	}

	public async withdrawal(
		accountId: string,
		idempotencyKey: string,
		dto: WithdrawalAmountRequest
	): Promise<WithdrawalAmountResponse> {
		const account = await this.accountRepo.findBy({ id: accountId });
		if (!account || account.deletedAt)
			throw new UnauthorizedException('Аккаунт не существует');

		const balance = await this.balanceRepo.findBalance(account.id);
		if (!balance || balance.blockedAt)
			throw new NotFoundException('Баланс не найден');

		const { amountInCents, withdrawalAccount, amount } = dto;

		if (balance.amount < amountInCents)
			throw new BadRequestException('Недостаточно средств');

		const tx = await this.balanceRepo
			.txWithdrawal(
				accountId,
				idempotencyKey,
				amountInCents,
				withdrawalAccount
			)
			.catch(error => {
				this.logger.warn(
					`[${account.id}] [${account.role}] [${TransactionType.WITHDRAWAL}] FAIL ${amount}$ TO "${withdrawalAccount}": ${error}`
				);
				throw new TransactionException(
					error instanceof Error ? error.message : String(error)
				);
			});

		this.logger.log(
			`[${account.id}] [${account.role}] [${TransactionType.WITHDRAWAL}] SUCCESS ${tx.amount.toDollars()}$ TO "${withdrawalAccount}"`
		);

		return {
			...tx,
			withdrawalAccount,
			amount: tx.amount.toDollars()
		};
	}

	public async transfer(
		accountId: string,
		idempotencyKey: string,
		dto: TransferAmountRequest
	): Promise<TransferAmountResponse> {
		const { amountInCents, toAccountId, amount } = dto;

		const [fromAccount, toAccount] = await Promise.all([
			this.accountRepo.findBy({ id: accountId }),
			this.accountRepo.findBy({ id: toAccountId })
		]);
		if (!fromAccount || fromAccount.deletedAt)
			throw new UnauthorizedException('Ваш аккаунт не существует');
		if (!toAccount || toAccount.deletedAt)
			throw new UnauthorizedException(
				'Aккаунта получателя не существует'
			);

		const [fromBalance, toBalance] = await Promise.all([
			this.balanceRepo.findBalance(fromAccount.id),
			this.balanceRepo.findBalance(toAccount.id)
		]);
		if (!fromBalance || fromBalance.blockedAt)
			throw new NotFoundException('Ваш баланс заблокирован');
		if (!toBalance || toBalance.blockedAt)
			throw new NotFoundException('Баланс получателя заблокирован');

		if (fromBalance.amount < amountInCents)
			throw new BadRequestException('Недостаточно средств');

		const tx = await this.balanceRepo
			.txTransfer(
				fromAccount.id,
				toAccount.id,
				idempotencyKey,
				amountInCents
			)
			.catch(error => {
				this.logger.warn(
					`[${fromAccount.id}] [${fromAccount.role}] [${TransactionType.TRANSFER_IN}] FAIL ${amount}$ TO accountId="${toAccount.id}": ${error}`
				);
				throw new TransactionException(
					error instanceof Error ? error.message : String(error)
				);
			});

		this.logger.log(
			`[${fromAccount.id}] [${fromAccount.role}] [${TransactionType.TRANSFER_IN}] SUCCESS ${tx.amount.toDollars()}$ TO accountId="${toAccount.id}"`
		);

		return {
			...tx,
			toAccountId,
			amount: tx.amount.toDollars()
		};
	}
}
