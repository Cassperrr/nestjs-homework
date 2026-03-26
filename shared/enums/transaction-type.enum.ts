export const TransactionType = {
	DEPOSIT: 'DEPOSIT',
	WITHDRAWAL: 'WITHDRAWAL',
	TRANSFER_IN: 'TRANSFER_IN',
	TRANSFER_OUT: 'TRANSFER_OUT'
} as const;

export type TransactionType =
	(typeof TransactionType)[keyof typeof TransactionType];
