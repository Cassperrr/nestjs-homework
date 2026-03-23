import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAvatarRequest {
	@ApiProperty({
		description: 'Название файла',
		example: 'uuid.png'
	})
	@IsString({ message: 'Название файла должно быть строкой' })
	@IsNotEmpty({ message: 'Название файла должно быть заполнено' })
	readonly fileName: string;
}
