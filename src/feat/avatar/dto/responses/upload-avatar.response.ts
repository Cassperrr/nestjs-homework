import { ApiProperty } from '@nestjs/swagger';

export class UploadAvatarResponse {
	@ApiProperty({
		description: 'Путь до файла',
		example: 'avatars/uuid.png'
	})
	readonly path: string;
}
