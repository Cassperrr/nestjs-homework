import {
	Injectable,
	Logger,
	UnprocessableEntityException
} from '@nestjs/common';
import type { AvatarResponse } from 'contracts/gen/avatar';

import { AbstractStorageService, AvatarClientGrpc } from './infra';

@Injectable()
export class FileService {
	private readonly logger = new Logger(FileService.name);

	public constructor(
		private readonly avatarClient: AvatarClientGrpc,
		private readonly storageService: AbstractStorageService
	) {}

	public async saveAvatarPath(
		accountId: string,
		avatar: Express.Multer.File
	): Promise<AvatarResponse> {
		if (!avatar)
			throw new UnprocessableEntityException('Файл не был загружен');

		const { path } = avatar;

		this.logger.log(
			`[${path}] Аватар загружен (stream). Попытка сохранения имени...`
		);

		try {
			const created = await this.avatarClient.call('createAvatar', {
				accountId,
				path
			});

			this.logger.log(`[${path}] Аватар успешно сохранен`);

			return created;
		} catch (e) {
			this.logger.warn(
				`[${path}] Ошибка загрузки аватара (stream), удаление аватара из хранилища:\n${e}`
			);
			await this.storageService.removeFile({ path });
			throw e;
		}
	}

	public async deleteAvatarPath(accountId: string, fileName: string) {
		if (!fileName)
			throw new UnprocessableEntityException('Имя файла не передано');

		const path = `avatars/${fileName}`;

		this.logger.log(`[${path}] Попытка удаление файла...`);

		try {
			const deleted = await this.avatarClient.call('deleteAvatar', {
				accountId,
				fileName
			});

			this.logger.log(`[${path}] Аватар успешно удален`);

			return deleted;
		} catch (e) {
			this.logger.warn(`[${path}] Ошибка удаления аватара: \n${e}`);
			throw e;
		}
	}
}
