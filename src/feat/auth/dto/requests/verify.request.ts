import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Length,
	Matches
} from 'class-validator';
import type { ITransformValue } from 'src/shared';

export class VerifyRequest {
	@ApiProperty({
		description: 'Почта в любом формате',
		example: 'email@menti.ru'
	})
	@IsNotEmpty({ message: 'Email должен быть заполнен' })
	@IsEmail({}, { message: 'Некорректный формат Email' })
	@Transform(({ value }: ITransformValue) => value.trim().toLowerCase())
	readonly email: string;

	@ApiProperty({
		description: 'OTP код для верификации',
		example: '600700'
	})
	@IsNotEmpty({ message: 'Code должен быть заполнен' })
	@IsString({ message: 'Code должен быть строкой' })
	@Length(6, 6, { message: 'Код должен быть 6 цифр' })
	@Matches(/^\d{6}$/, { message: 'Код должен содержать только цифры' })
	readonly code: string;
}
