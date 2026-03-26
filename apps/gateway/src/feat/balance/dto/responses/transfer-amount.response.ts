import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from 'shared';

export class TransferAmountResponse {
	@ApiProperty({
		description: 'Id транзакции',
		example: 'uuid'
	})
	readonly id: string;

	@ApiProperty({
		description: 'Сумма перевода USD',
		example: '1000.50'
	})
	readonly amount: string;

	@ApiProperty({
		description: 'Тип транзакции',
		example: TransactionType.TRANSFER_IN
	})
	readonly type: string;

	@ApiProperty({
		description: 'Account Id получателя',
		example: 'uuid'
	})
	readonly toAccountId: string;

	@ApiProperty({
		description: 'Время создания транзакции',
		example: '2026-03-11T00:30:20.000Z'
	})
	readonly createdAt: string;
}
