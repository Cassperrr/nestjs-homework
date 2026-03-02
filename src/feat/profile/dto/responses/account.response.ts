import { ApiProperty } from '@nestjs/swagger';

export class AccountResponse {
	@ApiProperty({
		description: 'Id пользователя',
		example: '019ca435-6422-7274-93bb-610bb137e977'
	})
	public id: string;

	@ApiProperty({
		description: 'Имя пользователя',
		example: 'Cassperrr1'
	})
	public username: string;

	@ApiProperty({
		description: 'Email пользователя',
		example: 'email@menti.ru'
	})
	public email: string;

	@ApiProperty({
		description: 'Дата регистрации',
		example: '2026-01-01T00:00:00.000Z'
	})
	public createdAt: Date;
}
