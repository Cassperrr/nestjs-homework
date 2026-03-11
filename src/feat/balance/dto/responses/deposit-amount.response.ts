import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from 'prisma/generated/enums';

export class DepositAmountResponse {
	@ApiProperty({
		description: 'Id транзакции',
		example: 'uuid'
	})
	readonly id: string;

	@ApiProperty({
		description: 'Сумма пополнения',
		example: '1000.50'
	})
	readonly amount: string;

	@ApiProperty({
		description: 'Тип транзакции',
		example: TransactionType.DEPOSIT
	})
	readonly type: TransactionType;

	@ApiProperty({
		description: 'Время создания транзакции',
		example: '2026-03-11T00:30:20.000Z'
	})
	readonly createdAt: Date;
}
