import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from 'prisma/generated/enums';

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
	readonly type: TransactionType;

	@ApiProperty({
		description: 'Account Id получателя',
		example: 'uuid'
	})
	readonly toAccountId: string;

	@ApiProperty({
		description: 'Время создания транзакции',
		example: '2026-03-11T00:30:20.000Z'
	})
	readonly createdAt: Date;
}
