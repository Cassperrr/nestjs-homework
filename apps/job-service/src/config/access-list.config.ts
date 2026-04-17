import { defineAccessList } from '@libs/utils';

export const ACCESS_LIST = defineAccessList({
	user_service: process.env.USER_ACCESS_TOKEN!
});
