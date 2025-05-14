export enum ChannelType {
	TEXT = "text",
	VOICE = "voice",
}

export type Channel = {
	id: number;
	name: string;
	type: ChannelType;
	serverId: number;
	createdAt: string;
	updatedAt: string;
};

export type Member = {
	id: number;
	username: string;
	roleId: number;
};

export type Server = {
	id: number;
	name: string;
	channels: Channel[];
	members: Member[];
	createdAt: string;
	updatedAt: string;
};

export type Message = {
	id: number;
	content: string;
	user: Member;
	createdAt: string;
	updatedAt: string;
};
