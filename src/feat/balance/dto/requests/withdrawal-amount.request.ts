import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsNumber,
	IsPositive,
	IsString,
	Max,
	Min
} from 'class-validator';

export class WithdrawalAmountRequest {
	@ApiProperty({
		description: 'Сумма вывода в USD',
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

	@ApiProperty({
		description: 'Счет банка для вывода USD',
		example: '2200 3405 4567 3234'
	})
	@IsNotEmpty({ message: 'Счет в банке для вывода должен быть заполнен' })
	@IsString({ message: 'Счет для вывода должен быть строкой' })
	readonly withdrawalAccount: string;

	get amountInCents(): bigint {
		return BigInt(Math.round(this.amount * 100));
	}
}
