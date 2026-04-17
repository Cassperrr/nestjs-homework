import { SetMetadata } from '@nestjs/common';

export const SIZE_KEY = 'required_size';

export const SetFileSize = (size: number) => SetMetadata(SIZE_KEY, size);
