export const RMQ_QUEUES = {
	MAIL: {
		name: 'MAIL_QUEUE',
		env: { url: 'RMQ_URL' }
	},
	NOTIFICATION: {
		name: 'NOTIFICATION_QUEUE',
		env: { url: 'RMQ_URL' }
	}
} as const;
