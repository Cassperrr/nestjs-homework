import {
	AccountResponse,
	ProfileResponse
} from '@gateway/src/feat/profile/dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponse extends AccountResponse {
	@ApiProperty({ type: () => ProfileResponse, required: false })
	readonly profile?: ProfileResponse;
}
