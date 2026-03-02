import { ApiProperty } from '@nestjs/swagger';

import { UserResponse } from './user.response';

export class AllUsersResponse {
	@ApiProperty({
		description: 'Список пользователей',
		type: () => UserResponse,
		isArray: true
	})
	public data: UserResponse[];

	@ApiProperty({
		description: 'Следующий пользователь',
		example: 'uuid',
		nullable: true
	})
	public nextCursor: string | null;

	@ApiProperty({
		description: 'Существует ли следующая старница'
	})
	public hasNextPage: boolean;
}
