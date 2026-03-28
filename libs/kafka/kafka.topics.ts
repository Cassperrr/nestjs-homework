export const KafkaTopics = {
	AVATAR_DELETE_REQUESTED: 'avatar.delete.requested',
	AVATAR_PATH_CLEARED: 'avatar.path.cleared',
	AVATAR_FILE_DELETED: 'avatar.file.deleted'
} as const;

export type KafkaTopic = (typeof KafkaTopics)[keyof typeof KafkaTopics];
