import { ApiProperty } from '@nestjs/swagger';

class BalanceResponse {
	@ApiProperty({
		description: 'Количество средств',
		example: '3000.1'
	})
	readonly amount: string;

	@ApiProperty({
		description: 'Валюта',
		example: 'RUB'
	})
	readonly currency: string;

	@ApiProperty({
		description: 'Дата блокировки (если есть)',
		example: '2024-01-01T00:00:00.000Z',
		required: false,
		nullable: true
	})
	readonly blockedAt?: string | undefined;
}

export class GetMyBalancesResponse {
	@ApiProperty({
		type: [BalanceResponse]
	})
	readonly balances: BalanceResponse[];
}
