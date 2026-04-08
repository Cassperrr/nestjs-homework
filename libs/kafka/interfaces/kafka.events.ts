import type { Currency } from 'shared';

export interface DepositCompletedEvent {
	amount: string;
	currency: Currency;
	accountId: string;
	eventId: string;
	transactionId: string;
}

export interface BalanceDepositSuccessEvent {
	eventId: string;
	transactionId: string;
}

export interface BalanceDepositFailedEvent {
	eventId: string;
	transactionId: string;
}

export interface TransferPendingEvent {
	eventId: string;
	outId: string;
	inId: string;
	fromAccountId: string;
	toAccountId: string;
	currency: Currency;
	amount: string;
}

export interface BalanceTranferSuccessEvent {
	eventId: string;
	outId: string;
	inId: string;
}

export interface BalanceTranferFailedEvent {
	eventId: string;
	outId: string;
	inId: string;
}

export interface TransferCompletedEvent {
	fromAccountId: string;
	toAccountId: string;
	amount: string;
	currency: Currency;
}
