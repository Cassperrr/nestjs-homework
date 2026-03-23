import { ApiProperty } from '@nestjs/swagger';

export class AuditBalanceResponse {
	@ApiProperty({
		description: 'Баланс пользователя USD',
		example: '101.1'
	})
	readonly balance: string;

	@ApiProperty({
		description: 'Аггрегатный баланс из истории транзакций',
		example: '101.1'
	})
	readonly aggregate: string;

	@ApiProperty({
		description: 'Результат аудита',
		example: true
	})
	readonly isConsistent: boolean;
}
