import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import type { ITransformValue } from 'src/shared';

export class ResendRequest {
	@ApiProperty({
		description: 'Почта в любом формате',
		example: 'email@menti.ru'
	})
	@IsNotEmpty({ message: 'Email должен быть заполнен' })
	@IsEmail({}, { message: 'Некорректный формат Email' })
	@Transform(({ value }: ITransformValue) => value.trim().toLowerCase())
	readonly email: string;
}
