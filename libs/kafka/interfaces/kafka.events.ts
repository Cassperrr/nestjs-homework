import { Currency } from 'shared';

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
