import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { HEADERS_KEY } from '../constants';
import { HeadersGuard } from '../guards';

/**
 * Устанавливает headers для валидации входящего proxy-запроса
 * @param headers Заголовки, наличие которых нужно проверить
 * @returns
 */
export const CheckHeaders = (...headers: string[]) => {
	return applyDecorators(
		SetMetadata(HEADERS_KEY, headers),
		UseGuards(HeadersGuard)
	);
};
