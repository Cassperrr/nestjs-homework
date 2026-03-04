import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import type { TransformValue } from 'src/shared';

export class ResendRequest {
	@ApiProperty({
		description: 'Почта в любом формате',
		example: 'email@menti.ru'
	})
	@IsNotEmpty({ message: 'Email должен быть заполнен' })
	@IsEmail({}, { message: 'Некорректный формат Email' })
	@Transform(({ value }: TransformValue) => value.trim().toLowerCase())
	public email: string;
}
