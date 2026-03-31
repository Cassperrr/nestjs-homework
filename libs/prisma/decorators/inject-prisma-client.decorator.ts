import { Inject } from '@nestjs/common';

import { PRISMA_CLIENT_TOKEN } from '../constants';

export const InjectPrismaClient = () => Inject(PRISMA_CLIENT_TOKEN);
