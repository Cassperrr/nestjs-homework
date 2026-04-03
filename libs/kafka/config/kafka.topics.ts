export const KafkaTopics = {
	TX_DEPOSIT_COMPLETED: 'tx.deposit.completed',
	BALANCE_UPDATED_SUCCESS: 'balance.updated.success',
	BALANCE_UPDATED_FAILED: 'balance.updated.failed'
} as const;

export type KafkaTopic = (typeof KafkaTopics)[keyof typeof KafkaTopics];
