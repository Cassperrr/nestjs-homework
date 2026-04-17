import { ApiProperty } from '@nestjs/swagger';

class ActiveUserResponse {
	@ApiProperty({
		description: 'Account Id пользователя',
		example: 'uuid'
	})
	readonly accountId: string;

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
	readonly createdAt: string;

	@ApiProperty({
		description: 'Profile Id пользователя',
		example: 'uuid'
	})
	readonly profileId: string;

	@ApiProperty({
		description: 'Имя пользователя',
		example: 'Alonzo'
	})
	readonly firstName: string;

	@ApiProperty({
		description: 'Фамилия пользователя',
		example: 'Blick'
	})
	readonly lastName: string;

	@ApiProperty({
		description: 'Возраст пользователя',
		example: 50
	})
	readonly age: number;

	@ApiProperty({
		description: 'Описание пользователя',
		example: 'text'
	})
	readonly description?: string;

	@ApiProperty({
		description: 'Последняя загруженная аватарка',
		example: 'uuid.png'
	})
	readonly lastLoadedAvatar: string;
}

export class FindActiveUsersResponse {
	@ApiProperty({
		type: () => ActiveUserResponse,
		isArray: true
	})
	readonly users: ActiveUserResponse[];
}
