import { ApiProperty } from '@nestjs/swagger';

export class OtpCodeResponse {
	@ApiProperty({
		description: 'Otp code',
		example: '600700'
	})
	readonly code: string;
}
