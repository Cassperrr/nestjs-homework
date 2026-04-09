import { Injectable } from '@nestjs/common';
import type {
	Account,
	PrismaClient
} from '@user-service/prisma/generated/client';
import { InjectPrismaClient } from 'libsV2/prisma';
import { Currency } from 'shared';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class AccountRepository {
	public constructor(
		@InjectPrismaClient() private readonly prisma: PrismaClient
	) {}

	public async create(account: {
		email: string;
		username: string;
		password: string;
	}) {
		return this.prisma.account.create({
			data: {
				id: uuidv7(),
				...account,
				balance: {
					createMany: {
						data: [
							{ id: uuidv7(), currency: Currency.RUB },
							{ id: uuidv7(), currency: Currency.USD },
							{ id: uuidv7(), currency: Currency.USDT }
						]
					}
				}
			},
			select: {
				id: true,
				role: true
			}
		});
	}

	public async update(id: string, account: Partial<Account>) {
		return this.prisma.account.update({
			where: { id },
			data: { ...account }
		});
	}

	public async findBy(params: {
		id?: string;
		email?: string;
		username?: string;
	}) {
		const { id, email, username } = params;

		return this.prisma.account.findFirst({
			where: {
				OR: [
					id ? { id } : undefined,
					email ? { email } : undefined,
					username ? { username } : undefined
				].filter(Boolean) as any[]
			}
		});
	}
}
