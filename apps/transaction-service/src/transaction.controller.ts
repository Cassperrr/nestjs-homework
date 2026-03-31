import { Controller } from '@nestjs/common';

import { TransactionService } from './transaction.service';

@Controller()
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}
}
