import { GrpcStatus } from '@libs/grpc';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AccountRepository, BalanceRepository } from '@user-service/src/core';
import { JobClientGrpc } from '@user-service/src/infra';
import type {
	AuditBalanceRequest,
	AuditBalanceResponse,
	BalanceResetJobRequest,
	CheckBalanceRequest,
	CheckBalanceResponse,
	DepositAmountRequest,
	DepositAmountResponse,
	GetMyBalancesRequest,
	GetMyBalancesResponse,
	ResetAllBalancesResponse,
	TransferAmountRequest,
	TransferAmountResponse,
	ValidationAccountRequest,
	ValidationAccountResponse,
	WithdrawalAmountRequest,
	WithdrawalAmountResponse
} from 'contracts/gen/balance';
import { StringMessage } from 'contracts/gen/shared';
import { TransactionType } from 'shared';
import 'shared/extensions/bigint.extension';

@Injectable()
export class BalanceService {
	private readonly logger = new Logger(BalanceService.name);

	public constructor(
		private readonly balanceRepo: BalanceRepository,
		private readonly accountRepo: AccountRepository,
		private readonly jobClient: JobClientGrpc
	) {}

	public async getMyBalances(
		data: GetMyBalancesRequest
	): Promise<GetMyBalancesResponse> {
		const { accountId } = data;

		const account = await this.accountRepo.findBy({ id: accountId });

		if (!account || account.deletedAt)
			throw new RpcException({
				code: GrpcStatus.UNAUTHENTICATED,
				details: 'Аккаунт не существует'
			});

		const balances = await this.balanceRepo.findBalances(account.id);

		if (balances.length === 0)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Счета не найдены'
			});

		return {
			balances: balances.map(b => ({
				amount: b.amount.toDollarsStr(),
				currency: b.currency,
				blockedAt: b.blockedAt?.toISOString()
			}))
		};
	}

	public async validationAccount(
		data: ValidationAccountRequest
	): Promise<ValidationAccountResponse> {
		const { accountId, currency } = data;

		const account = await this.accountRepo.findBy({ id: accountId });

		if (!account || account.deletedAt)
			throw new RpcException({
				code: GrpcStatus.UNAUTHENTICATED,
				details: 'Аккаунт не существует'
			});

		const balance = await this.balanceRepo.findBalance(
			account.id,
			currency
		);

		if (!balance || balance.blockedAt)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Счет не найден или заблокирвован'
			});

		return { amount: balance.amount };
	}

	public async putResetBalanceJob(
		data: BalanceResetJobRequest
	): Promise<StringMessage> {
		const { accountId } = data;

		const account = await this.accountRepo.findBy({ id: accountId });

		if (!account || account.deletedAt)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Ваш аккаунт не существует или удален'
			});

		await this.jobClient.call('putResetBalanceJob', {});

		this.logger.log(
			`[${account.id}] [${account.role}] Положил в очередь Cron job "balane-reset-all"`
		);

		return { message: 'Job "balane-reset-all" отправлен в очередь' };
	}

	public async startResetBalanceJob(
		data: BalanceResetJobRequest
	): Promise<StringMessage> {
		const { accountId } = data;

		const account = await this.accountRepo.findBy({ id: accountId });

		if (!account || account.deletedAt)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Ваш аккаунт не существует или удален'
			});

		await this.jobClient.call('startResetBalanceJob', {});

		this.logger.log(
			`[${account.id}] [${account.role}] Запустил Cron job "balane-reset-all"`
		);

		return { message: 'Job "balane-reset-all" запущен' };
	}

	public async stopResetBalanceJob(
		data: BalanceResetJobRequest
	): Promise<StringMessage> {
		const { accountId } = data;

		const account = await this.accountRepo.findBy({ id: accountId });

		if (!account || account.deletedAt)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Ваш аккаунт не существует или удален'
			});

		await this.jobClient.call('stopResetBalanceJob', {});

		this.logger.log(
			`[${account.id}] [${account.role}] Остановил Cron job "balane-reset-all"`
		);

		return { message: 'Job "balane-reset-all" остановлен' };
	}

	public async resetAllBalances(): Promise<ResetAllBalancesResponse> {
		const resetCounts = await this.balanceRepo.resetAllBalances();

		this.logger.warn(`Произошло обнуление всех балансов пользователей`);

		return { resetCounts };
	}
}
