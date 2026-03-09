import { ApiProperty } from '@nestjs/swagger';

export class ActiveUserResponse {
	@ApiProperty({
		description: 'Account Id пользователя',
		example: 'uuid'
	})
	readonly id: string;

	@ApiProperty({
		description: 'Последняя загруженная аватарка',
		example: 'uuid.png'
	})
	readonly last_loaded_avatar: string;
}
