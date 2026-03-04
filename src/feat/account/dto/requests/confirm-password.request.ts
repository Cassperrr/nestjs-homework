import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsString,
	Length,
	Matches,
	MaxLength,
	MinLength
} from 'class-validator';

export class ConfirmPasswordRequest {
	@ApiProperty({
		description:
			'Пароль 8-255 символов, минимум одна заглавная буква, минимум одна цифра, минимум один спецсимвол (!@#$%^&*)',
		example: 'IamBadPassword2#',
		minLength: 8,
		maxLength: 255
	})
	@MinLength(8, { message: 'Пароль должен быть не меньше 8 символов' })
	@MaxLength(255, {
		message: 'Пароль должен быть не больше 255 символов'
	})
	@IsNotEmpty({ message: 'Пароль должен быть заполнен' })
	@IsString({ message: 'Пароль должен быть строкой' })
	@Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/, {
		message:
			'Пароль должен содержать заглавную букву, цифру и спецсимвол (!@#$%^&*) и не содержать пробелов'
	})
	public newPassword: string;

	@ApiProperty({
		description: 'OTP код для верификации',
		example: '600700'
	})
	@IsNotEmpty({ message: 'Code должен быть заполнен' })
	@IsString({ message: 'Code должен быть строкой' })
	@Length(6, 6, { message: 'Код должен быть 6 цифр' })
	@Matches(/^\d{6}$/, { message: 'Код должен содержать только цифры' })
	public code: string;
}
