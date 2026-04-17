export interface OtpRequestedPayload {
	email: string;
	code: string;
}

export interface DepositCreditedPayload {
	transactionId: string;
	accountId: string;
	amount: string;
	currency: string;
}

export interface TransferCompletedPayload {
	outTx: string;
	inTx: string;
	fromAccountId: string;
	toAccountId: string;
	amount: string;
	currency: string;
}
