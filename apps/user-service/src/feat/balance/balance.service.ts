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

	// public async checkBalance(
	// 	data: CheckBalanceRequest
	// ): Promise<CheckBalanceResponse> {
	// 	const { accountId } = data;

	// 	const account = await this.accountRepo.findBy({ id: accountId });

	// 	if (!account || account.deletedAt)
	// 		throw new RpcException({
	// 			code: GrpcStatus.UNAUTHENTICATED,
	// 			details: 'Аккаунт не существует'
	// 		});

	// 	const balance = await this.balanceRepo.findBalance(account.id);

	// 	if (!balance || balance.blockedAt)
	// 		throw new RpcException({
	// 			code: GrpcStatus.NOT_FOUND,
	// 			details: 'Счет не найден или заблокирвован'
	// 		});

	// 	return { amount: balance.amount };
	// }

	// public async auditBalance(
	// 	data: AuditBalanceRequest
	// ): Promise<AuditBalanceResponse> {
	// 	const { accountId, accountIdForAudit } = data;

	// 	const account = await this.accountRepo.findBy({ id: accountId });

	// 	if (!account || account.deletedAt)
	// 		throw new RpcException({
	// 			code: GrpcStatus.UNAUTHENTICATED,
	// 			details: 'Ваш аккаунт не существует или удален'
	// 		});

	// 	const auditingAccount = await this.accountRepo.findBy({
	// 		id: accountIdForAudit
	// 	});

	// 	if (!auditingAccount)
	// 		throw new RpcException({
	// 			code: GrpcStatus.NOT_FOUND,
	// 			details: 'Аккаунт отправленный на аудит не существует'
	// 		});

	// 	const balance = await this.balanceRepo.findBalance(auditingAccount.id);

	// 	if (!balance)
	// 		throw new RpcException({
	// 			code: GrpcStatus.NOT_FOUND,
	// 			details: 'Счет не найден'
	// 		});

	// 	const aggregate = await this.balanceRepo.aggregateTxAmounts(
	// 		auditingAccount.id
	// 	);

	// 	return {
	// 		balance: balance.amount.toDollars(),
	// 		aggregate: aggregate.toDollars(),
	// 		isConsistent: balance.amount === aggregate
	// 	};
	// }

	// public async depositAmount(
	// 	data: DepositAmountRequest
	// ): Promise<DepositAmountResponse> {
	// 	const { accountId, idempotencyKey, amount } = data;

	// 	const account = await this.accountRepo.findBy({ id: accountId });

	// 	if (!account || account.deletedAt)
	// 		throw new RpcException({
	// 			code: GrpcStatus.NOT_FOUND,
	// 			details: 'Ваш аккаунт не существует или удален'
	// 		});

	// 	const balance = await this.balanceRepo.findBalance(account.id);

	// 	if (!balance || balance.blockedAt)
	// 		throw new RpcException({
	// 			code: GrpcStatus.NOT_FOUND,
	// 			details: 'Счет не найден или заблокирован'
	// 		});

	// 	const tx = await this.balanceRepo
	// 		.txDeposit(accountId, idempotencyKey, amount)
	// 		.catch(error => {
	// 			this.logger.warn(
	// 				`[${account.id}] [${account.role}] [${TransactionType.DEPOSIT}] FAIL ${amount}$: ${error}`
	// 			);
	// 			throw new RpcException({
	// 				code: GrpcStatus.CANCELLED,
	// 				details:
	// 					error instanceof Error ? error.message : String(error)
	// 			});
	// 		});

	// 	this.logger.log(
	// 		`[${account.id}] [${account.role}] [${tx.type}] SUCCESS ${tx.amount.toDollars()}$`
	// 	);

	// 	return {
	// 		...tx,
	// 		amount: tx.amount.toDollars(),
	// 		createdAt: tx.createdAt.toISOString()
	// 	};
	// }

	// public async withdrawalAmount(
	// 	data: WithdrawalAmountRequest
	// ): Promise<WithdrawalAmountResponse> {
	// 	const { accountId, idempotencyKey, amount, withdrawalAccount } = data;

	// 	const account = await this.accountRepo.findBy({ id: accountId });

	// 	if (!account || account.deletedAt)
	// 		throw new RpcException({
	// 			code: GrpcStatus.NOT_FOUND,
	// 			details: 'Ваш аккаунт не существует или удален'
	// 		});

	// 	const balance = await this.balanceRepo.findBalance(account.id);

	// 	if (!balance || balance.blockedAt)
	// 		throw new RpcException({
	// 			code: GrpcStatus.NOT_FOUND,
	// 			details: 'Счет не найден или заблокирован'
	// 		});

	// 	const tx = await this.balanceRepo
	// 		.txWithdrawal(accountId, idempotencyKey, amount, withdrawalAccount)
	// 		.catch(error => {
	// 			this.logger.warn(
	// 				`[${account.id}] [${account.role}] [${TransactionType.WITHDRAWAL}] FAIL ${amount}$ TO "${withdrawalAccount}": ${error}`
	// 			);
	// 			throw new RpcException({
	// 				code: GrpcStatus.CANCELLED,
	// 				details:
	// 					error instanceof Error ? error.message : String(error)
	// 			});
	// 		});

	// 	this.logger.log(
	// 		`[${account.id}] [${account.role}] [${tx.type}] SUCCESS ${tx.amount.toDollars()}$ TO "${withdrawalAccount}"`
	// 	);

	// 	return {
	// 		...tx,
	// 		withdrawalAccount,
	// 		amount: tx.amount.toDollars(),
	// 		createdAt: tx.createdAt.toISOString()
	// 	};
	// }

	// public async transferAmount(
	// 	data: TransferAmountRequest
	// ): Promise<TransferAmountResponse> {
	// 	const { accountId, idempotencyKey, amount, toAccountId } = data;

	// 	if (accountId === toAccountId)
	// 		throw new RpcException({
	// 			code: GrpcStatus.INVALID_ARGUMENT,
	// 			details: 'Нельзя переводить самому себе'
	// 		});

	// 	const [fromAccount, toAccount] = await Promise.all([
	// 		this.accountRepo.findBy({ id: accountId }),
	// 		this.accountRepo.findBy({ id: toAccountId })
	// 	]);

	// 	if (!fromAccount || fromAccount.deletedAt)
	// 		throw new RpcException({
	// 			code: GrpcStatus.NOT_FOUND,
	// 			details: 'Ваш аккаунт не существует или удален'
	// 		});
	// 	if (!toAccount || toAccount.deletedAt)
	// 		throw new RpcException({
	// 			code: GrpcStatus.NOT_FOUND,
	// 			details: 'Aккаунта получателя не существует или удален'
	// 		});

	// 	const [fromBalance, toBalance] = await Promise.all([
	// 		this.balanceRepo.findBalance(fromAccount.id),
	// 		this.balanceRepo.findBalance(toAccount.id)
	// 	]);

	// 	if (!fromBalance || fromBalance.blockedAt)
	// 		throw new RpcException({
	// 			code: GrpcStatus.NOT_FOUND,
	// 			details: 'Ваш счет не существет или заблокирован'
	// 		});
	// 	if (!toBalance || toBalance.blockedAt)
	// 		throw new RpcException({
	// 			code: GrpcStatus.NOT_FOUND,
	// 			details: 'Счет получателя не существет или заблокирован'
	// 		});

	// 	const tx = await this.balanceRepo
	// 		.txTransfer(fromAccount.id, toAccount.id, idempotencyKey, amount)
	// 		.catch(error => {
	// 			this.logger.warn(
	// 				`[${fromAccount.id}] [${fromAccount.role}] [${TransactionType.TRANSFER_OUT}] FAIL ${amount}$ TO accountId="${toAccount.id}": ${error}`
	// 			);
	// 			throw new RpcException({
	// 				code: GrpcStatus.CANCELLED,
	// 				details:
	// 					error instanceof Error ? error.message : String(error)
	// 			});
	// 		});

	// 	this.logger.log(
	// 		`[${fromAccount.id}] [${fromAccount.role}] [${tx.type}] SUCCESS ${tx.amount.toDollars()}$ TO accountId="${toAccount.id}"`
	// 	);

	// 	return {
	// 		...tx,
	// 		toAccountId,
	// 		amount: tx.amount.toDollars(),
	// 		createdAt: tx.createdAt.toISOString()
	// 	};
	// }

	// public async putResetBalanceJob(
	// 	data: BalanceResetJobRequest
	// ): Promise<StringMessage> {
	// 	const { accountId } = data;

	// 	const account = await this.accountRepo.findBy({ id: accountId });

	// 	if (!account || account.deletedAt)
	// 		throw new RpcException({
	// 			code: GrpcStatus.NOT_FOUND,
	// 			details: 'Ваш аккаунт не существует или удален'
	// 		});

	// 	await this.jobClient.call('putResetBalanceJob', {});

	// 	this.logger.log(
	// 		`[${account.id}] [${account.role}] Положил в очередь Cron job "balane-reset-all"`
	// 	);

	// 	return { message: 'Job "balane-reset-all" отправлен в очередь' };
	// }

	// public async startResetBalanceJob(
	// 	data: BalanceResetJobRequest
	// ): Promise<StringMessage> {
	// 	const { accountId } = data;

	// 	const account = await this.accountRepo.findBy({ id: accountId });

	// 	if (!account || account.deletedAt)
	// 		throw new RpcException({
	// 			code: GrpcStatus.NOT_FOUND,
	// 			details: 'Ваш аккаунт не существует или удален'
	// 		});

	// 	await this.jobClient.call('startResetBalanceJob', {});

	// 	this.logger.log(
	// 		`[${account.id}] [${account.role}] Запустил Cron job "balane-reset-all"`
	// 	);

	// 	return { message: 'Job "balane-reset-all" запущен' };
	// }

	// public async stopResetBalanceJob(
	// 	data: BalanceResetJobRequest
	// ): Promise<StringMessage> {
	// 	const { accountId } = data;

	// 	const account = await this.accountRepo.findBy({ id: accountId });

	// 	if (!account || account.deletedAt)
	// 		throw new RpcException({
	// 			code: GrpcStatus.NOT_FOUND,
	// 			details: 'Ваш аккаунт не существует или удален'
	// 		});

	// 	await this.jobClient.call('stopResetBalanceJob', {});

	// 	this.logger.log(
	// 		`[${account.id}] [${account.role}] Остановил Cron job "balane-reset-all"`
	// 	);

	// 	return { message: 'Job "balane-reset-all" остановлен' };
	// }

	// // TODO здесь можно реализовать проверку API token по которому будет првоеряться что этот метод вызвал именно job-service а не другой сервис
	// public async resetAllBalances(): Promise<ResetAllBalancesResponse> {
	// 	const resetCounts = await this.balanceRepo.resetAllBalances();

	// 	this.logger.warn(`Произошло обнуление всех балансов пользователей`);

	// 	return { resetCounts };
	// }
}
