export interface IJobService {
	enqueue(): Promise<unknown>;
	cronEnequeu(): Promise<unknown>;
	startCron(): void;
	stopCron(): void;
}
