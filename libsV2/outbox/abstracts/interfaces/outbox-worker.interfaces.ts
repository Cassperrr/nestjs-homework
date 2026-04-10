export interface OutboxEvent {
	id: string;
	topic: string;
	payload: any;
}
