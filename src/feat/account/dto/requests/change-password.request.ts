import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength
} from 'class-validator';

export class ChangePasswordRequest {
	@ApiProperty({
		description:
			'Пароль 8-255 символов, минимум одна заглавная буква, минимум одна цифра, минимум один спецсимвол (!@#$%^&*)',
		example: 'IamBadPassword1#',
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
	public oldPassword: string;

	// @ApiProperty({
	// 	description:
	// 		'Пароль 8-255 символов, минимум одна заглавная буква, минимум одна цифра, минимум один спецсимвол (!@#$%^&*)',
	// 	example: 'IamBadPassword2#',
	// 	minLength: 8,
	// 	maxLength: 255
	// })
	// @IsNotEmpty({ message: 'New password должен быть заполнен' })
	// @IsString({ message: 'New password должен быть строкой' })
	// @MinLength(8, { message: 'New password должен быть не меньше 8 символов' })
	// @MaxLength(255, {
	// 	message: 'New password должен быть не больше 255 символов'
	// })
	// @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/, {
	// 	message:
	// 		'New password должен содержать заглавную букву, цифру и спецсимвол (!@#$%^&*) и не содержать пробелов'
	// })
	// public newPassword: string;
}
