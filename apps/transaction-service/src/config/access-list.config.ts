import { defineAccessList } from 'libsV2/utils';

export const ACCESS_LIST = defineAccessList({
	gateway: process.env.GATEWAY_ACCESS_TOKEN!
});
