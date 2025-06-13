export type CreateChannelPayload = {
	name: string;
	type: string;
	serverId: number;
	categoryId: number | null;
};

export type DeleteChannelPayload = {
	serverId: number;
    channelId: number;
};
