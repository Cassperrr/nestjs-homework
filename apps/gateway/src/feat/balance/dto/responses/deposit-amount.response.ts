import { ApiProperty } from '@nestjs/swagger';

export class DepositAmountResponse {
	@ApiProperty({
		description: 'Ссылка на оплату',
		example: 'https://url.com'
	})
	readonly url: string;
}
