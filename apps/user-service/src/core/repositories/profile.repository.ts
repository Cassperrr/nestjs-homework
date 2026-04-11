import { Injectable } from '@nestjs/common';
import type {
	PrismaClient,
	Profile
} from '@user-service/prisma/generated/client';
import { InjectPrismaClient } from 'libs/prisma';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class ProfileRepository {
	public constructor(
		@InjectPrismaClient() private readonly prisma: PrismaClient
	) {}

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
