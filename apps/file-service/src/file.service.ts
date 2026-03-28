import {
	Injectable,
	Logger,
	UnprocessableEntityException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AvatarResponse } from 'contracts/gen/avatar';

import { FileServiceEnv } from './config';
import { AbstractStorageService, AvatarClientGrpc } from './infra';

@Injectable()
export class FileService {
	private readonly logger = new Logger(FileService.name);
	private readonly USER_FILE_API_TOKEN: string;

	public constructor(
		private readonly avatarClient: AvatarClientGrpc,
		private readonly storageService: AbstractStorageService,
		private readonly config: ConfigService<FileServiceEnv, true>
	) {
		this.USER_FILE_API_TOKEN = config.get('USER_FILE_API_TOKEN', {
			infer: true
		});
	}

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
				apiToken: this.USER_FILE_API_TOKEN,
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
				apiToken: this.USER_FILE_API_TOKEN,
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
