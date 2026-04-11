import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TransactionType } from 'shared';

@Schema({ timestamps: true })
export class TransactionDoc {
	@Prop({ required: true, type: String, enum: TransactionType })
	type!: TransactionType;

	// DEPOSIT fields
	@Prop() transactionId?: string;
	@Prop() accountId?: string;

	// TRANSFER fields
	@Prop() outTx?: string;
	@Prop() inTx?: string;
	@Prop() fromAccountId?: string;
	@Prop() toAccountId?: string;

	// Common
	@Prop({ required: true })
	amount!: string;

	@Prop({ required: true })
	currency!: string;
}

export type TransactionDocument = TransactionDoc & Document;

export const TransactionDocSchema =
	SchemaFactory.createForClass(TransactionDoc);
