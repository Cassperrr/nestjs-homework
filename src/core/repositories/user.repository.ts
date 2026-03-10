import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra';

@Injectable()
export class UserRepository {
	public constructor(private readonly prisma: PrismaService) {}

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
			},
			select: {
				id: true,
				username: true,
				email: true,
				role: true,
				createdAt: true,
				deletedAt: true,
				profile: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						age: true,
						description: true,
						avatars: {
							where: { deletedAt: null },
							select: {
								id: true,
								name: true
							}
						}
					}
				}
			}
		});
	}

	public async findAll(
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
						description: true,
						avatars: {
							select: {
								id: true,
								name: true
							}
						}
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

	// я хз как это нормально переписать на призму поэтому надежней так :)
	// ==== условия активных юзеров ====
	// > 2 АКТИВНЫX аватарок
	// есть описание
	// переданный диапазон возраста
	// === индексы поставил на возраст (на описание не стал потому что предположил что 90% профилей будет заполнено) и partional (deleted_at IS NULL) на аватар
	// !!!! блок с LEFT JOIN писала нейронка потмоу что у меня в коррелированном подзапросе на получение последней аватарки (через сортировку по убыванию) возникала n+1 и мозгов не хватило написать оконку
	public async findActive(minAge: number, maxAge: number) {
		return this.prisma.$queryRaw`
			SELECT accounts.id AS account_id, 
				username, 
				email,
				accounts.created_at,
				profiles.id AS profile_id,
				profiles.first_name,
				profiles.last_name,
				profiles.age,
				profiles.description,
				last_avatar.name AS last_loaded_avatar
			FROM accounts
				JOIN profiles ON profiles.account_id = accounts.id
				JOIN avatars ON profiles.id = avatars.profile_id
				LEFT JOIN (
					SELECT profile_id, name, ROW_NUMBER() OVER (
						PARTITION BY profile_id 
						ORDER BY created_at DESC
					) AS rn
					FROM avatars
					WHERE deleted_at IS NULL
				) AS last_avatar ON last_avatar.profile_id = profiles.id AND last_avatar.rn = 1
			WHERE profiles.age BETWEEN ${minAge} AND ${maxAge}
				AND avatars.deleted_at IS NULL
				AND profiles.description IS NOT NULL
			GROUP BY accounts.id, profiles.id, last_avatar.name
			HAVING count(avatars.id) > 2;
		`;
	}
}
