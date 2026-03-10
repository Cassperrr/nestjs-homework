import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra';

@Injectable()
export class BalanceRepository {
	public constructor(private readonly prisma: PrismaService) {}
}
