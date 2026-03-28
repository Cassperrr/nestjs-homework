import { applyDecorators, UseGuards } from '@nestjs/common';

import { UploadFileGuard } from '../../guards';

import { SetFileSize } from './set-file-size.decorator';

export const FileProtected = (size: number) => {
	return applyDecorators(SetFileSize(size), UseGuards(UploadFileGuard));
};
