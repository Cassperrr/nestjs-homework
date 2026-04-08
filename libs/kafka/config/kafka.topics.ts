export const KafkaTopics = {
	TX_DEPOSIT_COMPLETED: 'tx.deposit.completed',
	BALANCE_UPDATED_SUCCESS: 'balance.updated.success',
	BALANCE_UPDATED_FAILED: 'balance.updated.failed',
	TX_TRANSFER_PENDING: 'tx.transfer.pending',
	BALANCE_TRANSFER_SUCCESS: 'balance.transfer.success',
	BALANCE_TRANSFER_FAILED: 'balance.transfer.failed',
	TX_TRANSFER_COMPLETED: 'tx.tranfer.completed'
} as const;

export type KafkaTopic = (typeof KafkaTopics)[keyof typeof KafkaTopics];
