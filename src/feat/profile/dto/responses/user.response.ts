import { ApiProperty } from '@nestjs/swagger';

import { AccountResponse } from './account.response';
import { ProfileResponse } from './profile.response';

export class UserResponse extends AccountResponse {
	@ApiProperty({ type: () => ProfileResponse, required: false })
	readonly profile: ProfileResponse | null;
}
