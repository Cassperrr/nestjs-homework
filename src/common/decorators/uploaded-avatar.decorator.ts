import { UploadedFile } from '@nestjs/common';

import { parseAvatarPipe } from '../pipes';

export const UploadedAvatar = () => UploadedFile(parseAvatarPipe);
