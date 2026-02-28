import { Injectable } from '@nestjs/common';
import { Profile } from 'prisma/generated/client';
import { PrismaService } from 'src/infra';
import { uuidv7 } from 'uuidv7';

import { CreateProfileRequest } from './dto';

//дто в репу не нада, надо думать

@Injectable()
export class ProfileRepository {
	public constructor(private readonly prisma: PrismaService) {}

	public async findByAccountId(accountId: string) {
		return this.prisma.profile.findUnique({
			where: { accountId }
		});
	}

	public async create(accountId: string, profile: CreateProfileRequest) {
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

	public async findMeByAccountId(accountId: string) {
		return this.prisma.profile.findUnique({
			where: { accountId },
			select: {
				firstName: true,
				lastName: true,
				age: true,
				description: true,
				account: {
					select: {
						username: true,
						email: true,
						createdAt: true
					}
				}
			}
		});
	}
}
