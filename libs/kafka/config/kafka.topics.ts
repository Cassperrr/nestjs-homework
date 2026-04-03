export const KafkaTopics = {
	TX_DEPOSIT_COMPLETED: 'tx.deposit.completed'
} as const;

export type KafkaTopic = (typeof KafkaTopics)[keyof typeof KafkaTopics];
