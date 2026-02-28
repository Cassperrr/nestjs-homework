import { ApiProperty } from '@nestjs/swagger';

import { AccountResponse } from './account.response';
import { ProfileResponse } from './profile.response';

export class MeResponse extends ProfileResponse {
	@ApiProperty({ type: () => AccountResponse, required: false })
	public account?: AccountResponse;
}
