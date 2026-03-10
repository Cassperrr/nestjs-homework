import { ApiProperty } from '@nestjs/swagger';

export class ActiveUserResponse {
	@ApiProperty({
		description: 'Account Id пользователя',
		example: 'uuid'
	})
	readonly account_id: string;

	@ApiProperty({
		description: 'Username пользователя',
		example: 'FierceEagle724#'
	})
	readonly username: string;

	@ApiProperty({
		description: 'Email пользователя',
		example: 'dandre.thompson@gmail.com'
	})
	readonly email: string;

	@ApiProperty({
		description: 'Дата регистрации',
		example: '2026-03-10T00:00:00.000Z'
	})
	readonly created_at: Date;

	@ApiProperty({
		description: 'Profile Id пользователя',
		example: 'uuid'
	})
	readonly profile_id: string;

	@ApiProperty({
		description: 'Имя пользователя',
		example: 'Alonzo'
	})
	readonly first_name: string;

	@ApiProperty({
		description: 'Фамилия пользователя',
		example: 'Blick'
	})
	readonly last_name: string;

	@ApiProperty({
		description: 'Возраст пользователя',
		example: 50
	})
	readonly age: number;

	@ApiProperty({
		description: 'Описание пользователя',
		example: 'text'
	})
	readonly description: string;

	@ApiProperty({
		description: 'Последняя загруженная аватарка',
		example: 'uuid.png'
	})
	readonly last_loaded_avatar: string;
}
