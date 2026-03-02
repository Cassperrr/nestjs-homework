import { Injectable } from '@nestjs/common';
import { Profile } from 'prisma/generated/client';
import { PrismaService } from 'src/infra';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class ProfileRepository {
	public constructor(private readonly prisma: PrismaService) {}

	public async findProfileByAccountId(accountId: string) {
		return this.prisma.profile.findUnique({
			where: { accountId }
		});
	}

	public async create(
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
				firstName: true,
				lastName: true,
				age: true,
				description: true
			}
		});
	}

	public async update(accountId: string, profile: Partial<Profile>) {
		return this.prisma.profile.update({
			where: { accountId },
			data: { ...profile },
			select: {
				firstName: true,
				lastName: true,
				age: true,
				description: true
			}
		});
	}

	public async findUserByAccountId(accountId: string) {
		return this.prisma.account.findUnique({
			where: { id: accountId },
			select: {
				id: true,
				username: true,
				email: true,
				createdAt: true,
				profile: {
					select: {
						firstName: true,
						lastName: true,
						age: true,
						description: true
					}
				}
			}
		});
	}

	public async findUserByUsername(username: string) {
		return this.prisma.account.findFirst({
			where: { username },
			select: {
				id: true,
				username: true,
				email: true,
				createdAt: true,
				profile: {
					select: {
						firstName: true,
						lastName: true,
						age: true,
						description: true
					}
				}
			}
		});
	}

	public async findвывAllUsers(
		cursor: string | undefined,
		limit: number = 10,
		username: string | undefined
	) {
		const accounts = await this.prisma.profile.findMany({
			where: username
				? {
						account: {
							username: {
								contains: username,
								mode: 'insensitive'
							}
						}
					}
				: {},
			take: limit + 1,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { accountId: cursor } : undefined,
			orderBy: { createdAt: 'asc' },
			select: {
				firstName: true,
				lastName: true,
				age: true,
				description: true,
				account: {
					select: {
						id: true,
						username: true,
						email: true,
						createdAt: true
					}
				}
			}
		});

		const hasNextPage = accounts.length > limit;
		if (hasNextPage) accounts.pop();

		return {
			data: accounts,
			nextCursor: hasNextPage
				? accounts[accounts.length - 1].account.id
				: null,
			hasNextPage
		};
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
