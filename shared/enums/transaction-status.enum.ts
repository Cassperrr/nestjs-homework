export const TransactionStatus = {
	PENDING: 'PENDING',
	COMPLETED: 'COMPLETED',
	BALANCE_UPDATED: 'BALANCE_UPDATED',
	BALANCE_FAILED: 'BALANCE_FAILED',
	FAILED: 'FAILED',
	TIMEOUT: 'TIMEOUT'
} as const;

export type TransactionStatus =
	(typeof TransactionStatus)[keyof typeof TransactionStatus];
