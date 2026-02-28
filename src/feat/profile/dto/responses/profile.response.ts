import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponse {
	@ApiProperty({
		description: 'Имя пользователя',
		example: 'Джеймс'
	})
	public firstName: string;

	@ApiProperty({
		description: 'Фамилия пользователя',
		example: 'Бонд'
	})
	public lastName: string;

	@ApiProperty({
		description: 'Возраст пользователя',
		example: 50
	})
	public age: number;

	@ApiProperty({
		description: 'Описание пользователя',
		example: null,
		required: false,
		nullable: true
	})
	public description: string | null;
}
