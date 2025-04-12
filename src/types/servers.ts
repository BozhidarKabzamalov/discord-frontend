enum ChannelType {
    Text = 'TEXT',
    Voice = 'VOICE',
}

export type Channel = {
	id: number;
	name: string;
	type: ChannelType;
	serverId: number;
	createdAt: string;
	updatedAt: string;
};

export type Server = {
    id: number;
    name: string;
    channels: Channel[];
    createdAt: string;
    updatedAt: string;
}