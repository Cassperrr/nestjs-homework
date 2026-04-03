import { defineAccessList } from '@libs/utils';

export const ACCESS_LIST = defineAccessList({
	gateway: process.env.GATEWAY_ACCESS_TOKEN!
});
