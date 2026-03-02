import { Injectable } from '@nestjs/common';
import { Account, Profile } from 'prisma/generated/browser';
import { PrismaService } from 'src/infra';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class UserRepository {
	public constructor(private readonly prisma: PrismaService) {}

	public async createAccount(account: {
		email: string;
		username: string;
		password: string; // TODO чет надо придумать некрасиво
	}) {
		const { id } = await this.prisma.account.create({
			data: {
				id: uuidv7(),
				...account
			}
		});

		return id;
	}

	public async updateAccount(id: string, account: Partial<Account>) {
		return this.prisma.account.update({
			where: { id },
			data: { ...account }
		});
	}

	public async findAccountByEmailOrUsername(email: string, username: string) {
		return this.prisma.account.findFirst({
			where: {
				OR: [{ email }, { username }]
			}
		});
	}

	public async findAccount(params: {
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

	public async createProfile(
		accountId: string,
		profile: {
			firstName: string;
			lastName: string;
			age: number;
			description?: string; // TODO чет надо придумать некрасиво
		}
	) {
		return this.prisma.profile.create({
			data: {
				id: uuidv7(),
				...profile,
				account: { connect: { id: accountId } }
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				age: true,
				description: true
			}
		});
	}

	public async updateProfile(accountId: string, profile: Partial<Profile>) {
		return this.prisma.profile.update({
			where: { accountId },
			data: { ...profile },
			select: {
				id: true,
				firstName: true,
				lastName: true,
				age: true,
				description: true
			}
		});
	}

	public async findUser(params: {
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
			},
			select: {
				id: true,
				username: true,
				email: true,
				createdAt: true,
				deletedAt: true,
				profile: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						age: true,
						description: true
					}
				}
			}
		});
	}

	public async findAllUsers(
		cursor: string | undefined,
		limit: number = 10,
		username: string | undefined
	) {
		const accounts = await this.prisma.account.findMany({
			where: username
				? {
						username: {
							contains: username,
							mode: 'insensitive'
						}
					}
				: {},
			take: limit + 1,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { id: cursor } : undefined,
			orderBy: { createdAt: 'asc' },
			select: {
				id: true,
				username: true,
				email: true,
				createdAt: true,
				profile: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						age: true,
						description: true
					}
				}
			}
		});

		const hasNextPage = accounts.length > limit;
		if (hasNextPage) accounts.pop();

		return {
			data: accounts,
			nextCursor: hasNextPage ? accounts[accounts.length - 1].id : null,
			hasNextPage
		};
	}
}
