import { Injectable } from '@nestjs/common';
import type { Account } from 'prisma/generated/client';
import { PrismaService } from 'src/infra';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class AccountRepository {
	public constructor(private readonly prisma: PrismaService) {}

	public async create(email: string, username: string, password: string) {
		const { id } = await this.prisma.account.create({
			data: {
				id: uuidv7(),
				email,
				username,
				password
			}
		});

		return id;
	}

	public async findByEmailOrUsername(email: string, username: string) {
		return this.prisma.account.findFirst({
			where: {
				OR: [{ email }, { username }]
			}
		});
	}

	public async findByEmail(email: string) {
		return this.prisma.account.findUnique({
			where: { email }
		});
	}

	public async findByUsername(username: string) {
		return this.prisma.account.findUnique({
			where: { username }
		});
	}

	public async findById(id: string) {
		return this.prisma.account.findUnique({
			where: { id }
		});
	}

	public async update(id: string, account: Partial<Account>) {
		return this.prisma.account.update({
			where: { id },
			data: { ...account }
		});
	}
}
