import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from 'prisma/generated/enums';

export class WithdrawalAmountResponse {
	@ApiProperty({
		description: 'Id транзакции',
		example: 'uuid'
	})
	readonly id: string;

	@ApiProperty({
		description: 'Сумма вывода',
		example: '1000.50'
	})
	readonly amount: string;

	@ApiProperty({
		description: 'Тип транзакции',
		example: TransactionType.WITHDRAWAL
	})
	readonly type: TransactionType;

	@ApiProperty({
		description: 'Банковский счет вывода',
		example: '2200 xxxx xxxx xxxx'
	})
	readonly withdrawalAccount: string;

	@ApiProperty({
		description: 'Время создания транзакции',
		example: '2026-03-11T00:30:20.000Z'
	})
	readonly createdAt: Date;
}
