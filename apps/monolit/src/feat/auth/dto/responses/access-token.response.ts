import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenResponse {
	@ApiProperty({
		description: 'Access token for Bearer auth',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
	})
	readonly accessToken: string;
}
