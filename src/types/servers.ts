export enum ChannelType {
	TEXT = "text",
	VOICE = "voice",
}

export type Category = {
    id: string;
    name: string;
    serverId: number;
    channels: Channel[];
    createdAt: string;
	updatedAt: string;
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
    categories: Category[];
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
