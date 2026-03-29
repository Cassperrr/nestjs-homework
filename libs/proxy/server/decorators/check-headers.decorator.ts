import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { HEADERS_KEY } from '../constants';
import { HeadersGuard } from '../guards';

export const CheckHeaders = (...headers: string[]) => {
	return applyDecorators(
		SetMetadata(HEADERS_KEY, headers),
		UseGuards(HeadersGuard)
	);
};
