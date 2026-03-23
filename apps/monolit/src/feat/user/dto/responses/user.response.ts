import { ApiProperty } from '@nestjs/swagger';
import { AccountResponse, ProfileResponse } from 'src/feat/profile/dto';

export class UserResponse extends AccountResponse {
	@ApiProperty({ type: () => ProfileResponse, required: false })
	readonly profile: ProfileResponse | null;
}
