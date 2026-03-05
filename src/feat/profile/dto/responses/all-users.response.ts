import { ApiProperty } from '@nestjs/swagger';

import { UserResponse } from './user.response';

export class AllUsersResponse {
	@ApiProperty({
		description: 'Список пользователей',
		type: () => UserResponse,
		isArray: true
	})
	readonly data: UserResponse[];

	@ApiProperty({
		description: 'Следующий пользователь',
		example: 'uuid',
		nullable: true
	})
	readonly nextCursor: string | null;

	@ApiProperty({
		description: 'Существует ли следующая старница'
	})
	readonly hasNextPage: boolean;
}
