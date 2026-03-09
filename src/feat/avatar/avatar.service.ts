import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvTypes } from 'src/config';
import { UserRepository } from 'src/core';
import { IFileService } from 'src/shared';

import { UploadAvatarResponse } from './dto';

@Injectable()
export class AvatarService {
	private readonly logger = new Logger(AvatarService.name);

	public constructor(
		private readonly userRepo: UserRepository,
		private readonly fileService: IFileService,

		private readonly configService: ConfigService<EnvTypes, true>
	) {}

	public async uploadAvatar(
		accountId: string,
		avatar: Express.Multer.File
	): Promise<UploadAvatarResponse> {
		const user = await this.userRepo.findUser({ id: accountId });
		const maxAvatars = this.configService.get('MAX_AVATARS_FOR_PROFILE', {
			infer: true
		});

		if (!user || user.deletedAt || !user.profile)
			throw new NotFoundException('Нет доступа');

		if (user.profile.avatars.length >= maxAvatars)
			throw new BadRequestException(
				`Максимальное количество аватарок - ${maxAvatars} шт.`
			);

		this.logger.log(
			`[${user.id}] [${user.role}] Start uploading avatar ${user.profile.avatars.length + 1}/${maxAvatars}...`
		);

		const { path } = await this.fileService.uploadFile({
			folder: 'avatars',
			file: avatar
		});

		await this.userRepo.createAvatar(user.profile.id, path.split('/')[1]);

		this.logger.log(
			`[${user.id}] [${user.role}] Avatar uploaded. Path: ${path}`
		);

		return { path };
	}
}
