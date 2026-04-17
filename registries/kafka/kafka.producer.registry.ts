export const KAFKA_PRODUCERS = {
	TRANSACTION: {
		id: 'transaction-service',
		groupId: 'transaction-service-group',
		env: {
			broker: 'KAFKA_BROKER'
		}
	},
	USER: {
		id: 'user-service',
		groupId: 'user-service-group',
		env: {
			broker: 'KAFKA_BROKER'
		}
	}
} as const;
