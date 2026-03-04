import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength
} from 'class-validator';
import type { TransformValue } from 'src/shared';

export class LoginRequest {
	@ApiProperty({
		description: 'Уникальный Username',
		example: 'Cassperrr1',
		minLength: 3,
		maxLength: 50
	})
	@IsNotEmpty({ message: 'Username должен быть заполнен' })
	@IsString({ message: 'Username должен быть строкой' })
	@MinLength(3, { message: 'Username должен быть не меньше 3 символов' })
	@MaxLength(50, { message: 'Username должен быть не больше 50 символов' })
	@Matches(/^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/, {
		message:
			'Username должен содержать минимум одну заглавную букву и одну цифру'
	})
	@Transform(({ value }: TransformValue) => value.trim())
	public username: string;

	@ApiProperty({
		description:
			'Пароль 8-255 символов, минимум одна заглавная буква, минимум одна цифра, минимум один спецсимвол (!@#$%^&*)',
		example: 'IamBadPassword1#',
		minLength: 8,
		maxLength: 255
	})
	@IsNotEmpty({ message: 'Password должен быть заполнен' })
	@IsString({ message: 'Password должен быть строкой' })
	@MinLength(8, { message: 'Password должен быть не меньше 8 символов' })
	@MaxLength(255, { message: 'Password должен быть не больше 255 символов' })
	@Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/, {
		message:
			'Password должен содержать заглавную букву, цифру и спецсимвол (!@#$%^&*) и не содержать пробелов'
	})
	public password: string;
}
