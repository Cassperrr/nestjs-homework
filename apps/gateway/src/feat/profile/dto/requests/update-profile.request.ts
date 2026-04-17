import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsPositive,
	IsString,
	Max,
	MaxLength
} from 'class-validator';
import { TransformValue } from 'shared';

export class UpdateProfileRequest {
	@ApiProperty({
		description: 'Имя пользователя',
		example: 'Джеймс'
	})
	@IsOptional()
	@IsNotEmpty({ message: 'Имя должно быть заполнено' })
	@IsString({ message: 'Имя должно быть строкой' })
	@MaxLength(50, { message: 'Имя должно быть до 50 символов' })
	@Transform(({ value }: TransformValue) => value?.trim())
	readonly firstName?: string;

	@ApiProperty({
		description: 'Фамилия пользователя',
		example: 'Бонд'
	})
	@IsOptional()
	@IsNotEmpty({ message: 'Фамилия должна быть заполнена' })
	@IsString({ message: 'Фамилия должна быть строкой' })
	@MaxLength(50, { message: 'Фамилия должна быть до 50 символов' })
	@Transform(({ value }: TransformValue) => value?.trim())
	readonly lastName?: string;

	@ApiProperty({
		description: 'Возраст пользователя',
		example: 24,
		maximum: 120,
		minimum: 1
	})
	@IsOptional()
	@IsInt({ message: 'Возраст должен быть целым числом' })
	@IsPositive({ message: 'Возраст должен быть положительным' })
	@Max(120, { message: 'Возраст должен быть не больше 120' })
	readonly age?: number;

	@ApiProperty({
		description: 'Описание себя',
		example: 'Продаю людей, бананы...',
		maximum: 120,
		minimum: 1
	})
	@IsOptional()
	@IsString({ message: 'Описание должно быть строкой' })
	@MaxLength(500, { message: 'Описание должно быть до 500 символов' })
	@Transform(({ value }: TransformValue) => value?.trim())
	readonly description?: string;
}
