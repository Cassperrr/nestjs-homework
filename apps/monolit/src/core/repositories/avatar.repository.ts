import { Injectable } from '@nestjs/common';
import { Avatar } from 'prisma/generated/client';
import { PrismaService } from 'src/infra';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class AvatarRepository {
	public constructor(private readonly prisma: PrismaService) {}

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
