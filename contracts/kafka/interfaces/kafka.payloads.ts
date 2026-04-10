export interface DepositPaidSuccessPayload {
	amount: string;
	currency: string;
	accountId: string;
	eventId: string;
	transactionId: string;
}

export interface DepositSuccessPayload {
	eventId: string;
	transactionId: string;
}

export interface DepositFailedPayload {
	eventId: string;
	transactionId: string;
}

export interface TransferInitedPayload {
	eventId: string;
	outId: string;
	inId: string;
	fromAccountId: string;
	toAccountId: string;
	currency: string;
	amount: string;
}

export interface TransferSuccessPayload {
	eventId: string;
	outId: string;
	inId: string;
}

export interface TransferFailedPayload {
	eventId: string;
	outId: string;
	inId: string;
}

export interface TransferCompletedPayload {
	fromAccountId: string;
	toAccountId: string;
	amount: string;
	currency: string;
}
