export interface DepositPaidSuccessPayload {
	eventId: string;
	transactionId: string;
	accountId: string;
	currency: string;
	amount: string;
}

export interface DepositCreditingSuccessPayload {
	eventId: string;
	transactionId: string;
}

export interface DepositCreditingFailedPayload {
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
