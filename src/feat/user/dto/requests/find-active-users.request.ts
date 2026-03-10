import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class FindActiveUsersRequest {
	@ApiProperty({
		description: 'Минимальный возраст',
		example: 16
	})
	@IsNotEmpty({ message: 'Возраст должен быть заполнен' })
	@IsInt({ message: 'Возраст должен быть целым числом' })
	@IsPositive({ message: 'Возраст должен быть положительным' })
	@Type(() => Number)
	readonly minAge: number;

	@ApiProperty({
		description: 'Максимальный возраст',
		example: 24
	})
	@IsNotEmpty({ message: 'Возраст должен быть заполнен' })
	@IsInt({ message: 'Возраст должен быть целым числом' })
	@IsPositive({ message: 'Возраст должен быть положительным' })
	@Type(() => Number)
	readonly maxAge: number;
}
