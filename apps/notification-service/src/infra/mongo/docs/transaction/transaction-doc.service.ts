import type {
	DepositCreditedPayload,
	TransferCompletedPayload
} from '@contracts';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionType } from 'shared';

import {
	TransactionDoc,
	type TransactionDocument
} from './transaction-doc.schema';

@Injectable()
export class TransactionDocService {
	private readonly logger = new Logger(TransactionDocService.name);

	public constructor(
		@InjectModel(TransactionDoc.name)
		private readonly model: Model<TransactionDocument>
	) {}

	public async saveDepositMessage(
		payload: DepositCreditedPayload
	): Promise<TransactionDoc> {
		const doc = new this.model({
			type: TransactionType.DEPOSIT,
			...payload
		});
		return doc.save();
	}

	async saveTransferMessage(
		payload: TransferCompletedPayload
	): Promise<TransactionDoc> {
		const doc = new this.model({
			type: TransactionType.TRANSFER_OUT,
			...payload
		});
		return doc.save();
	}
}
