import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma/generated/client';
import { PrismaService } from 'src/infra';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class BalanceRepository {
	public constructor(private readonly prisma: PrismaService) {}

	public async findBalance(accountId: string) {
		return this.prisma.balance.findUnique({
			where: { accountId },
			select: {
				amount: true,
				blockedAt: true
			}
		});
	}

	public async txDeposit(
		accountId: string,
		idempotencyKey: string,
		ammountInCents: bigint
	) {
		return this.prisma.$transaction(async tx => {
			// проверяем уникальность транзы
			const existingTx = await tx.transaction.findUnique({
				where: { idempotencyKey },
				select: {
					id: true,
					amount: true,
					type: true,
					createdAt: true
				}
			});
			// соблюдаем идемпотентность
			if (existingTx) return existingTx;

			// пессимистично блокируем
			const [balance] = await tx.$queryRaw<{ blocked_at: Date | null }[]>`
				SELECT * FROM balances WHERE account_id = ${accountId} FOR UPDATE
			`;

			// еще раз делаем проверку на идиота
			if (balance.blocked_at) throw new Error('Баланс заблокирован');

			const createdTx = await tx.transaction.create({
				data: {
					id: uuidv7(),
					accountId,
					amount: ammountInCents,
					type: 'DEPOSIT',
					idempotencyKey
				},
				select: {
					id: true,
					amount: true,
					type: true,
					createdAt: true
				}
			});

			await tx.balance.update({
				where: { accountId },
				data: { amount: { increment: ammountInCents } }
			});

			return createdTx;
		});
	}

	public async txWithdrawal(
		accountId: string,
		idempotencyKey: string,
		ammountInCents: bigint,
		withdrawalAccount: string
	) {
		return this.prisma.$transaction(async tx => {
			// проверяем уникальность транзы
			const existingTx = await tx.transaction.findUnique({
				where: { idempotencyKey },
				select: {
					id: true,
					amount: true,
					type: true,
					createdAt: true
				}
			});
			// соблюдаем идемпотентность
			if (existingTx) return existingTx;

			// пессимистично блокируем
			const [balance] = await tx.$queryRaw<
				{ amount: bigint; blocked_at: Date | null }[]
			>`
				SELECT * FROM balances WHERE account_id = ${accountId} FOR UPDATE
			`;

			// еще раз делаем проверку на идиота
			if (balance.blocked_at) throw new Error('Баланс заблокирован');
			if (balance.amount < ammountInCents)
				throw new Error('Недостаточно средств');

			const createdTx = await tx.transaction.create({
				data: {
					id: uuidv7(),
					accountId,
					amount: -ammountInCents,
					type: 'WITHDRAWAL',
					withdrawalAccount,
					idempotencyKey
				},
				select: {
					id: true,
					amount: true,
					type: true,
					withdrawalAccount: true,
					createdAt: true
				}
			});

			await tx.balance.update({
				where: { accountId },
				data: { amount: { decrement: ammountInCents } }
			});

			return createdTx;
		});
	}

	public async txTransfer(
		fromAccountId: string,
		toAccountId: string,
		idempotencyKey: string,
		ammountInCents: bigint
	) {
		return this.prisma.$transaction(async tx => {
			// соблюдаем идемпотентность
			const existing = await tx.transaction.findUnique({
				where: { idempotencyKey }
			});
			if (existing) return existing;

			// блокируем обе строки в одном порядке шоб не было дедлока
			const [firstId, secondId] = [fromAccountId, toAccountId].sort(); // по алфавиту
			const balances = await tx.$queryRaw<
				{
					account_id: string;
					amount: bigint;
					blocked_at: Date | null;
				}[]
			>`
				SELECT account_id, amount, blocked_at FROM balances
				WHERE account_id IN (${Prisma.join([firstId, secondId])}) 
				ORDER BY account_id
				FOR UPDATE
			`;

			// доп проверка на существование аккаунтов уже внутри транзакции
			if (balances.length < 2) {
				throw new Error('Один из аккаунтов не найден');
			}

			// находим баланс сендера по fromAccountId и проверяем есть ли бабки для первода
			const senderBalance = balances.find(
				b => b.account_id === fromAccountId
			);
			const receiverBalance = balances.find(
				b => b.account_id === toAccountId
			);

			if (!senderBalance || !receiverBalance) {
				throw new Error('Один из балансов не найден');
			}

			// првоеряем на блокировку счетов уже внутри транзакции
			if (senderBalance.blocked_at || receiverBalance.blocked_at) {
				throw new Error('Один из балансов заблокирован');
			}

			if (senderBalance.amount < ammountInCents)
				throw new Error('Недостаточно средств');

			const outId = uuidv7();
			const inId = uuidv7();

			const txOut = await tx.transaction.create({
				data: {
					id: outId,
					accountId: fromAccountId,
					amount: -ammountInCents,
					type: 'TRANSFER_OUT',
					idempotencyKey,
					referenceId: inId
				},
				select: {
					id: true,
					amount: true,
					type: true,
					createdAt: true
				}
			});

			await tx.transaction.create({
				data: {
					id: inId,
					accountId: toAccountId,
					amount: ammountInCents,
					type: 'TRANSFER_IN',
					idempotencyKey: `${idempotencyKey}_in`,
					referenceId: outId
				}
			});

			await tx.balance.update({
				where: { accountId: fromAccountId },
				data: { amount: { decrement: ammountInCents } }
			});

			await tx.balance.update({
				where: { accountId: toAccountId },
				data: { amount: { increment: ammountInCents } }
			});

			return txOut;
		});
	}
}
