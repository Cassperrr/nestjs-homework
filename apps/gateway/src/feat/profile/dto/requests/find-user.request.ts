import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { TransformValue } from 'shared';

export class FindUserRequest {
	@ApiProperty({
		description: 'Username пользователя',
		example: 'Cassperrr1'
	})
	@IsNotEmpty({ message: 'Username должен быть заполнен' })
	@IsString({ message: 'Username должен быть строкой' })
	@Transform(({ value }: TransformValue) => value?.trim())
	readonly username: string;
}
