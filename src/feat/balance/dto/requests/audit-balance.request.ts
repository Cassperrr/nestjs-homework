import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AuditBalanceRequest {
	@ApiProperty({
		description: 'Account Id пользователя для аудита',
		example: 'uuid'
	})
	@IsNotEmpty({ message: 'Account Id пользователя должен быть заполнен' })
	@IsUUID('7', { message: 'Account Id должен быть валидным UUID' })
	readonly accountId: string;
}
