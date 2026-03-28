import { GrpcStatus } from '@libs/grpc';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { UserServiceEnv } from '@user-service/src/config';
import { AccountRepository, BalanceRepository } from '@user-service/src/core';
import { JobClientGrpc } from '@user-service/src/infra/grpc/job-client';
import type {
	AuditBalanceRequest,
	AuditBalanceResponse,
	BalanceResetJobRequest,
	DepositAmountRequest,
	DepositAmountResponse,
	GetMyBalanceRequest,
	GetMyBalanceResponse,
	ResetAllBalancesRequest,
	ResetAllBalancesResponse,
	TransferAmountRequest,
	TransferAmountResponse,
	WithdrawalAmountRequest,
	WithdrawalAmountResponse
} from 'contracts/gen/balance';
import { StringMessage } from 'contracts/gen/shared';
import { TransactionType } from 'shared';
import 'shared/extensions/bigint.extension';

@Injectable()
export class BalanceService {
	private readonly logger = new Logger(BalanceService.name);
	private readonly USER_JOB_API_TOKEN: string;

	public constructor(
		private readonly balanceRepo: BalanceRepository,
		private readonly accountRepo: AccountRepository,
		private readonly jobClient: JobClientGrpc,
		private readonly config: ConfigService<UserServiceEnv, true>
	) {
		this.USER_JOB_API_TOKEN = config.get('USER_JOB_API_TOKEN', {
			infer: true
		});
	}

	public async getMyBalance(
		data: GetMyBalanceRequest
	): Promise<GetMyBalanceResponse> {
		const { accountId } = data;

		const account = await this.accountRepo.findBy({ id: accountId });

		if (!account || account.deletedAt)
			throw new RpcException({
				code: GrpcStatus.UNAUTHENTICATED,
				details: 'Аккаунт не существует'
			});

		const balance = await this.balanceRepo.findBalance(account.id);

		if (!balance || balance.blockedAt)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Счет не найден или заблокирвован'
			});

		return { balance: balance.amount.toDollars() };
	}

	public async auditBalance(
		data: AuditBalanceRequest
	): Promise<AuditBalanceResponse> {
		const { accountId, accountIdForAudit } = data;

		const account = await this.accountRepo.findBy({ id: accountId });

		if (!account || account.deletedAt)
			throw new RpcException({
				code: GrpcStatus.UNAUTHENTICATED,
				details: 'Ваш аккаунт не существует или удален'
			});

		const auditingAccount = await this.accountRepo.findBy({
			id: accountIdForAudit
		});

		if (!auditingAccount)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Аккаунт отправленный на аудит не существует'
			});

		const balance = await this.balanceRepo.findBalance(auditingAccount.id);

		if (!balance)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Счет не найден'
			});

		const aggregate = await this.balanceRepo.aggregateTxAmounts(
			auditingAccount.id
		);

		return {
			balance: balance.amount.toDollars(),
			aggregate: aggregate.toDollars(),
			isConsistent: balance.amount === aggregate
		};
	}

	public async depositAmount(
		data: DepositAmountRequest
	): Promise<DepositAmountResponse> {
		const { accountId, idempotencyKey, amount } = data;

		const account = await this.accountRepo.findBy({ id: accountId });

		if (!account || account.deletedAt)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Ваш аккаунт не существует или удален'
			});

		const balance = await this.balanceRepo.findBalance(account.id);

		if (!balance || balance.blockedAt)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Счет не найден или заблокирован'
			});

		const tx = await this.balanceRepo
			.txDeposit(accountId, idempotencyKey, amount)
			.catch(error => {
				this.logger.warn(
					`[${account.id}] [${account.role}] [${TransactionType.DEPOSIT}] FAIL ${amount}$: ${error}`
				);
				throw new RpcException({
					code: GrpcStatus.CANCELLED,
					details:
						error instanceof Error ? error.message : String(error)
				});
			});

		this.logger.log(
			`[${account.id}] [${account.role}] [${tx.type}] SUCCESS ${tx.amount.toDollars()}$`
		);

		return {
			...tx,
			amount: tx.amount.toDollars(),
			createdAt: tx.createdAt.toISOString()
		};
	}

	public async withdrawalAmount(
		data: WithdrawalAmountRequest
	): Promise<WithdrawalAmountResponse> {
		const { accountId, idempotencyKey, amount, withdrawalAccount } = data;

		const account = await this.accountRepo.findBy({ id: accountId });

		if (!account || account.deletedAt)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Ваш аккаунт не существует или удален'
			});

		const balance = await this.balanceRepo.findBalance(account.id);

		if (!balance || balance.blockedAt)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Счет не найден или заблокирован'
			});

		const tx = await this.balanceRepo
			.txWithdrawal(accountId, idempotencyKey, amount, withdrawalAccount)
			.catch(error => {
				this.logger.warn(
					`[${account.id}] [${account.role}] [${TransactionType.WITHDRAWAL}] FAIL ${amount}$ TO "${withdrawalAccount}": ${error}`
				);
				throw new RpcException({
					code: GrpcStatus.CANCELLED,
					details:
						error instanceof Error ? error.message : String(error)
				});
			});

		this.logger.log(
			`[${account.id}] [${account.role}] [${tx.type}] SUCCESS ${tx.amount.toDollars()}$ TO "${withdrawalAccount}"`
		);

		return {
			...tx,
			withdrawalAccount,
			amount: tx.amount.toDollars(),
			createdAt: tx.createdAt.toISOString()
		};
	}

	public async transferAmount(
		data: TransferAmountRequest
	): Promise<TransferAmountResponse> {
		const { accountId, idempotencyKey, amount, toAccountId } = data;

		if (accountId === toAccountId)
			throw new RpcException({
				code: GrpcStatus.INVALID_ARGUMENT,
				details: 'Нельзя переводить самому себе'
			});

		const [fromAccount, toAccount] = await Promise.all([
			this.accountRepo.findBy({ id: accountId }),
			this.accountRepo.findBy({ id: toAccountId })
		]);

		if (!fromAccount || fromAccount.deletedAt)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Ваш аккаунт не существует или удален'
			});
		if (!toAccount || toAccount.deletedAt)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Aккаунта получателя не существует или удален'
			});

		const [fromBalance, toBalance] = await Promise.all([
			this.balanceRepo.findBalance(fromAccount.id),
			this.balanceRepo.findBalance(toAccount.id)
		]);

		if (!fromBalance || fromBalance.blockedAt)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Ваш счет не существет или заблокирован'
			});
		if (!toBalance || toBalance.blockedAt)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Счет получателя не существет или заблокирован'
			});

		const tx = await this.balanceRepo
			.txTransfer(fromAccount.id, toAccount.id, idempotencyKey, amount)
			.catch(error => {
				this.logger.warn(
					`[${fromAccount.id}] [${fromAccount.role}] [${TransactionType.TRANSFER_OUT}] FAIL ${amount}$ TO accountId="${toAccount.id}": ${error}`
				);
				throw new RpcException({
					code: GrpcStatus.CANCELLED,
					details:
						error instanceof Error ? error.message : String(error)
				});
			});

		this.logger.log(
			`[${fromAccount.id}] [${fromAccount.role}] [${tx.type}] SUCCESS ${tx.amount.toDollars()}$ TO accountId="${toAccount.id}"`
		);

		return {
			...tx,
			toAccountId,
			amount: tx.amount.toDollars(),
			createdAt: tx.createdAt.toISOString()
		};
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

	// TODO здесь можно реализовать проверку API token по которому будет првоеряться что этот метод вызвал именно job-service а не другой сервис
	public async resetAllBalances(
		data: ResetAllBalancesRequest
	): Promise<ResetAllBalancesResponse> {
		const { apiToken } = data;

		if (apiToken !== this.USER_JOB_API_TOKEN) {
			this.logger.error(
				`[resetAllBalances] Несанкционированный запрос чужеродного сервиса. Отказ в исполнении. Проверьте API ключи`
			);
			return { resetCounts: 0 };
		}

		const resetCounts = await this.balanceRepo.resetAllBalances();

		this.logger.warn(`Произошло обнуление всех балансов пользователей`);

		return { resetCounts };
	}
}
