import { ApiProperty } from '@nestjs/swagger';

export class BalanceResponse {
	@ApiProperty({
		description: 'Баланс пользователя USD',
		example: '101.1'
	})
	readonly balance: string;
}
