export type CreateChannelPayload = {
	name: string;
	type: string;
	serverId: number;
	categoryId: number | null;
};
