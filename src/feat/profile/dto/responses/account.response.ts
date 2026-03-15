import { ApiProperty } from '@nestjs/swagger';

export class AccountResponse {
	@ApiProperty({
		description: 'Id пользователя',
		example: 'uuid'
	})
	readonly id: string;

	@ApiProperty({
		description: 'Имя пользователя',
		example: 'Cassperrr1'
	})
	readonly username: string;

	@ApiProperty({
		description: 'Email пользователя',
		example: 'email@menti.ru'
	})
	readonly email: string;

	@ApiProperty({
		description: 'Дата регистрации',
		example: '2026-01-01T00:00:00.000Z'
	})
	readonly createdAt: Date;
}
