import { Injectable } from '@nestjs/common';
import { Profile } from 'prisma/generated/client';
import { PrismaService } from 'src/infra';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class ProfileRepository {
	public constructor(private readonly prisma: PrismaService) {}

	public async create(
		accountId: string,
		profile: {
			firstName: string;
			lastName: string;
			age: number;
			description?: string;
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

	public async update(accountId: string, profile: Partial<Profile>) {
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
}
