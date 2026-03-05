import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponse {
	@ApiProperty({
		description: 'Id профиля',
		example: 'uuid'
	})
	readonly id: string;

	@ApiProperty({
		description: 'Имя пользователя',
		example: 'Джеймс'
	})
	readonly firstName: string;

	@ApiProperty({
		description: 'Фамилия пользователя',
		example: 'Бонд'
	})
	readonly lastName: string;

	@ApiProperty({
		description: 'Возраст пользователя',
		example: 50
	})
	readonly age: number;

	@ApiProperty({
		description: 'Описание пользователя',
		example: null,
		required: false,
		nullable: true
	})
	readonly description: string | null;
}
