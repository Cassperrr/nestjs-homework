import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, Max } from 'class-validator';
import type { TransformValue } from 'src/shared';

export class FindAllUserRequest {
	@ApiProperty({
		description: 'Username пользователя',
		required: false,
		example: 'DarkEagle429^'
	})
	@IsOptional()
	@IsString({ message: 'Username должен быть строкой' })
	@Transform(({ value }: TransformValue) => value.trim())
	public username?: string;

	@ApiProperty({
		description: 'Следующий пользователь',
		required: false,
		example: 'uuid'
	})
	@IsOptional()
	@IsString({ message: 'Cursor должен быть строкой' })
	public cursor?: string;

	@ApiProperty({
		description: 'Количество аккаунтов пользователей',
		required: false,
		example: 10,
		default: 10
	})
	@IsOptional()
	@IsInt({ message: 'Limit должен быть положительным числом' })
	@IsPositive({ message: 'Limit должен быть положительным числом' })
	@Max(100, { message: 'Limit не должен превышать 100 пользователей за раз' })
	@Transform(({ value }: TransformValue) => parseInt(value))
	public limit?: number = 10;
}
