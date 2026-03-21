import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, Max, Min } from 'class-validator';

export class DepositAmountRequest {
	@ApiProperty({
		description: 'Сумма внесения в USD',
		example: 10.5
	})
	@IsNotEmpty({ message: 'Сумму нельзя оставлять пустой' })
	@IsNumber(
		{ maxDecimalPlaces: 2 },
		{ message: 'Максимум 2 знака после запятой' }
	)
	@IsPositive({ message: 'Сумма должна быть положительной' })
	@Min(0.01, { message: 'Минимальная сумма $0.01' })
	@Max(10000, { message: 'Максимальная сумма $10,000' })
	readonly amount: number;

	get amountInCents(): bigint {
		return BigInt(Math.round(this.amount * 100));
	}
}
