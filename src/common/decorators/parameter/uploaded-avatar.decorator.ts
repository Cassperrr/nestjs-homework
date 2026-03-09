import { UploadedFile } from '@nestjs/common';

import { parseAvatarPipe } from '../../pipes';

export const UploadedAvatar = ({ pipe = true }: { pipe?: boolean } = {}) =>
	pipe ? UploadedFile(parseAvatarPipe) : UploadedFile();
