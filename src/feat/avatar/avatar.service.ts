import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
	UnprocessableEntityException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Account } from 'prisma/generated/client';
import { EnvTypes } from 'src/config';
import { AvatarRepository, CACHE_EVENTS, UserRepository } from 'src/core';
import { AbstractFileService } from 'src/shared';

import { DeleteAvatarRequest, UploadAvatarResponse } from './dto';

@Injectable()
export class AvatarService {
	private readonly logger = new Logger(AvatarService.name);
	private readonly maxAvatars: number;

	public constructor(
		private readonly userRepo: UserRepository,
		private readonly avatarRepo: AvatarRepository,
		private readonly fileService: AbstractFileService,
		private readonly configService: ConfigService<EnvTypes, true>,
		private readonly eventEmmiter: EventEmitter2
	) {
		this.maxAvatars = configService.get('MAX_AVATARS_FOR_PROFILE', {
			infer: true
		});
	}

	private async _findAndCheckUser(accountId: string) {
		const user = await this.userRepo.findBy({ id: accountId });

		if (!user || user.deletedAt || !user.profile)
			throw new NotFoundException('Нет доступа');

		return user as typeof user & {
			profile: NonNullable<(typeof user)['profile']>;
		};
	}

	public async uploadAvatar(
		accountId: string,
		avatar: Express.Multer.File
	): Promise<UploadAvatarResponse> {
		const user = await this._findAndCheckUser(accountId);

		if (user.profile.avatars.length >= this.maxAvatars)
			throw new BadRequestException(
				`Максимальное количество аватарок - ${this.maxAvatars} шт.`
			);

		this.logger.log(
			`[${user.id}] [${user.role}] Start uploading avatar ${user.profile.avatars.length + 1}/${this.maxAvatars}...`
		);

		const { path } = await this.fileService.uploadFile({
			folder: 'avatars',
			file: avatar
		});

		await this.avatarRepo.create(user.profile.id, path.split('/')[1]);

		this.eventEmmiter.emit(CACHE_EVENTS.USERS_INVALIDATE);

		this.logger.log(
			`[${user.id}] [${user.role}] Avatar uploaded. Path: ${path}`
		);

		return { path };
	}

	public async saveAvatarPath(
		accountId: string,
		avatar: Express.Multer.File
	): Promise<UploadAvatarResponse> {
		if (!avatar)
			throw new UnprocessableEntityException('Файл не был загружен');

		const { path } = avatar;

		try {
			const user = await this._findAndCheckUser(accountId);

			if (user.profile.avatars.length >= this.maxAvatars)
				throw new BadRequestException(
					`Максимальное количество аватарок - ${this.maxAvatars} шт.`
				);

			await this.avatarRepo.create(user.profile.id, path.split('/')[1]);

			this.eventEmmiter.emit(CACHE_EVENTS.USERS_INVALIDATE);

			this.logger.log(
				`[${user.id}] [${user.role}] Avatar uploaded. Path: ${path}`
			);

			return { path };
		} catch (e) {
			this.logger.warn(
				`Ошибка загрузки аватара (stream), удаление аватара из хранилища: ${path}:\n${e}`
			);
			await this.fileService.removeFile({ path }).catch(() => null);
			throw e;
		}
	}

	public async deleteAvatar(accountId: string, dto: DeleteAvatarRequest) {
		await this._findAndCheckUser(accountId);

		const { fileName } = dto;

		const avatar = await this.avatarRepo
			.update(accountId, fileName, {
				deletedAt: new Date()
			})
			.catch(() => {
				throw new BadRequestException('Нет прав');
			});

		this.eventEmmiter.emit(CACHE_EVENTS.USERS_INVALIDATE);

		return { message: `Аватар ${avatar.name} удален` };
	}
}
