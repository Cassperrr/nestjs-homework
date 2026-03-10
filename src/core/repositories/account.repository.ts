import { Injectable } from '@nestjs/common';
import { Account } from 'prisma/generated/client';
import { PrismaService } from 'src/infra';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class AccountRepository {
	public constructor(private readonly prisma: PrismaService) {}

	public async create(account: {
		email: string;
		username: string;
		password: string;
	}) {
		return this.prisma.account.create({
			data: {
				id: uuidv7(),
				...account
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
