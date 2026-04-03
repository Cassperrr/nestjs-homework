export const TransactionStatus = {
	PENDING: 'PENDING', // платёж создан, ждём оплаты
	COMPLETED: 'COMPLETED', // ЮКасса подтвердила / перевод исполнен
	BALANCE_UPDATED: 'BALANCE_UPDATED', // user-service зачислил баланс (финал)
	BALANCE_FAILED: 'BALANCE_FAILED', // user-service не ответил, нужен retry
	FAILED: 'FAILED', // окончательная ошибка
	TIMEOUT: 'TIMEOUT' // отмененный со временем платеж (если человек не оплатил)
} as const;

export type TransactionStatus =
	(typeof TransactionStatus)[keyof typeof TransactionStatus];
