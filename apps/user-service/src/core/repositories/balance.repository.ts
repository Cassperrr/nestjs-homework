import { Injectable } from '@nestjs/common';
import {
	Prisma,
	type PrismaClient
} from '@user-service/prisma/generated/client';
import { InjectPrismaClient } from 'libs/prisma';
import { TransactionType } from 'shared';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class BalanceRepository {
	public constructor(
		@InjectPrismaClient() private readonly prisma: PrismaClient
	) {}

	public findBalances(accountId: string) {
		return this.prisma.balance.findMany({
			where: { accountId },
			select: {
				amount: true,
				currency: true,
				blockedAt: true
			}
		});
	}

	public findBalance(accountId: string, currency: string) {
		return this.prisma.balance.findFirst({
			where: { accountId, currency },
			select: {
				amount: true,
				currency: true,
				blockedAt: true
			}
		});
	}

	public deposit(
		transactionId: string,
		currency: string,
		amount: bigint,
		accountId: string,
		topic: string
	) {
		return this.prisma.$transaction(async tx => {
			// делать блокировку перед alreadyExist дороговато, но мне нужен баланс айди а тянуть его из метаданных юкассы влом
			const [balance] = await tx.$queryRaw<{ id: string }[]>`
				SELECT id 
				FROM balances
				WHERE account_id = ${accountId} AND currency = ${currency}
				FOR UPDATE
			`;

			// здесь проверку на заблокированный баланс делать не буду потому что она делается до поулчения ссылки на оплату и если уже человек оплатил и вэтот момент баланс заблокировали то видеть что сумма дошла спокойней чем если бы деньги просто пропали
			if (!balance) throw new Error('Счет не найден');

			const alreadyExist = await tx.processedEvent.findUnique({
				where: { idempotencyKey: transactionId }
			});

			if (alreadyExist)
				return tx.balance.findUnique({
					where: { id: balance.id },
					select: {
						accountId: true,
						amount: true,
						currency: true
					}
				});

			const updated = await tx.balance.update({
				where: { id: balance.id },
				data: { amount: { increment: amount } },
				select: {
					accountId: true,
					amount: true,
					currency: true
				}
			});

			await tx.processedEvent.create({
				data: { id: uuidv7(), idempotencyKey: transactionId, topic }
			});

			return updated;
		});
	}

	public async transfer(
		txOutId: string,
		fromAccountId: string,
		toAccountId: string,
		currency: string,
		amount: bigint,
		topic: string
	) {
		return this.prisma.$transaction(async tx => {
			// соблюдаем идемпотентность
			const alreadyExist = await tx.processedEvent.findUnique({
				where: { idempotencyKey: txOutId }
			});

			if (alreadyExist) return;

			// блокируем обе строки в одном порядке шоб не было дедлока
			const [firstId, secondId] = [fromAccountId, toAccountId].sort(); // по алфавиту
			const balances = await tx.$queryRaw<
				{
					id: string;
					account_id: string;
					amount: bigint;
					blocked_at: Date | null;
				}[]
			>`
				SELECT id, account_id, amount, blocked_at FROM balances
				WHERE account_id IN (${Prisma.join([firstId, secondId])}) AND currency = ${currency}
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

			if (senderBalance.amount < amount)
				throw new Error('Недостаточно средств');

			await tx.balance.update({
				where: { id: senderBalance.id },
				data: { amount: { decrement: amount } }
			});

			await tx.balance.update({
				where: { id: receiverBalance.id },
				data: { amount: { increment: amount } }
			});

			await tx.processedEvent.create({
				data: { id: uuidv7(), idempotencyKey: txOutId, topic }
			});

			return;
		});
	}

	public async resetAllBalances() {
		return this.prisma.$executeRaw`UPDATE balances SET amount = 0`;
	}
}
