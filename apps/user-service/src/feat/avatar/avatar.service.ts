import { GrpcStatus } from '@libs/grpc';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RpcException } from '@nestjs/microservices';
import type { UserServiceEnv } from '@user-service/src/config';
import {
	AvatarRepository,
	CACHE_EVENTS,
	UsersRepository
} from '@user-service/src/core';
import type {
	AvatarResponse,
	CreateAvatarRequest,
	DeleteAvatarRequest
} from 'contracts/gen/avatar';
import type { StringMessage } from 'contracts/gen/shared';

@Injectable()
export class AvatarService {
	private readonly logger = new Logger(AvatarService.name);
	private readonly USER_FILE_API_TOKEN: string;
	private readonly maxAvatars: number;

	public constructor(
		private readonly usersRepo: UsersRepository,
		private readonly avatarRepo: AvatarRepository,
		private readonly eventEmmiter: EventEmitter2,
		private readonly config: ConfigService<UserServiceEnv, true>
	) {
		this.USER_FILE_API_TOKEN = config.get('USER_FILE_API_TOKEN', {
			infer: true
		});
		this.maxAvatars = config.get('MAX_AVATARS_FOR_PROFILE', {
			infer: true
		});
	}

	public async createAvatar(
		data: CreateAvatarRequest
	): Promise<AvatarResponse> {
		const { accountId, apiToken, path } = data;

		if (apiToken !== this.USER_FILE_API_TOKEN) {
			this.logger.error(
				`[resetAllBalances] Несанкционированный запрос чужеродного сервиса. Отказ в исполнении. Проверьте API ключи`
			);
			throw new RpcException({
				code: GrpcStatus.UNAUTHENTICATED,
				details: 'Внутренняя ошибка сервисов'
			});
		}

		const user = await this.usersRepo.findBy({ id: accountId });

		if (!user || user.deletedAt || !user.profile)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Аккаунт либо удален, либо профиль не существует'
			});

		if (user.profile.avatars.length >= this.maxAvatars)
			throw new RpcException({
				code: GrpcStatus.INVALID_ARGUMENT,
				details: `Максимальное количество аватарок - ${this.maxAvatars} шт.`
			});

		const fileName = path.split('/')[1];

		const loaded = await this.avatarRepo.create(user.profile.id, fileName);

		this.eventEmmiter.emit(CACHE_EVENTS.USERS_INVALIDATE);

		this.logger.log(
			`[${user.id}] [${user.role}] Сохранено имя аватара: ${fileName}`
		);

		return loaded;
	}

	public async deleteAvatar(
		data: DeleteAvatarRequest
	): Promise<StringMessage> {
		const { accountId, apiToken, fileName } = data;

		if (apiToken !== this.USER_FILE_API_TOKEN) {
			this.logger.error(
				`[resetAllBalances] Несанкционированный запрос чужеродного сервиса. Отказ в исполнении. Проверьте API ключи`
			);
			throw new RpcException({
				code: GrpcStatus.UNAUTHENTICATED,
				details: 'Внутренняя ошибка сервисов'
			});
		}

		const user = await this.usersRepo.findBy({ id: accountId });

		if (!user || user.deletedAt || !user.profile)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Аккаунт либо удален, либо профиль не существует'
			});

		const avatar = await this.avatarRepo
			.update(accountId, fileName, {
				deletedAt: new Date()
			})
			.catch(() => {
				throw new RpcException({
					code: GrpcStatus.UNAUTHENTICATED,
					details: 'Нет прав'
				});
			});

		this.eventEmmiter.emit(CACHE_EVENTS.USERS_INVALIDATE);

		this.logger.log(
			`[${user.id}] [${user.role}] Soft-delete имя аватара: ${avatar.name}`
		);

		return { message: `Аватар ${fileName} успешно удален` };
	}
}
