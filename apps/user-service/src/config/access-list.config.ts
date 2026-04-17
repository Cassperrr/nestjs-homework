import { defineAccessList } from '@libs/utils';

export const ACCESS_LIST = defineAccessList({
	gateway: process.env.GATEWAY_ACCESS_TOKEN!,
	file_service: process.env.FILE_ACCESS_TOKEN!,
	job_service: process.env.JOB_ACCESS_TOKEN!,
	transaction_service: process.env.TX_ACCESS_TOKEN!
});
