import { ApiProperty } from '@nestjs/swagger';

export class AvatarResponse {
	@ApiProperty({
		description: 'Id аватара пользователя',
		example: 'uuid'
	})
	readonly id: string;

	@ApiProperty({
		description: 'Название файла',
		example: 'uuid.png'
	})
	readonly name: string;
}
