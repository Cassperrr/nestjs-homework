import { Injectable } from '@nestjs/common';
import type {
	Avatar,
	PrismaClient
} from '@user-service/prisma/generated/client';
import { InjectPrismaClient } from 'libs/prisma';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class AvatarRepository {
	public constructor(
		@InjectPrismaClient() private readonly prisma: PrismaClient
	) {}

	public async create(profileId: string, name: string) {
		return this.prisma.avatar.create({
			data: {
				id: uuidv7(),
				name,
				profile: { connect: { id: profileId } }
			},
			select: {
				id: true,
				name: true
			}
		});
	}

	public async update(
		accountId: string,
		fileName: string,
		avatar: Partial<Avatar>
	) {
		return this.prisma.avatar.update({
			where: { profile: { accountId }, name: fileName },
			data: { ...avatar },
			select: {
				id: true,
				name: true
			}
		});
	}
}
