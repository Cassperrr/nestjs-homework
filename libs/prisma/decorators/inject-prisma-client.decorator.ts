import { Inject } from '@nestjs/common';

import { PRISMA_CLIENT_TOKEN } from '../constants';

/**
 * Инжектирует сгенерированный PrismaClient
 * @returns
 */
export const InjectPrismaClient = () => Inject(PRISMA_CLIENT_TOKEN);
