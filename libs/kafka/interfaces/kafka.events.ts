import { Currency } from 'shared';

export interface DepositCompletedEvent {
	amount: string;
	currency: Currency;
	accountId: string;
	transactionId: string;
}
