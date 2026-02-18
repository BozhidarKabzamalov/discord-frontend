export type Server = {
    id: number;
    name: string;
    categories: Category[];
    members: Member[];
    createdAt: string;
    updatedAt: string;
};

export type Category = {
    id: number;
    name: string;
    serverId: number;
    channels: Channel[];
    createdAt: string;
    updatedAt: string;
};

export type Channel = {
    id: number;
    name: string;
    serverId: number;
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

export type Member = {
    id: number;
    username: string;
    roleId: number;
};

export type EditServerPayload = {
    name: string;
    serverId: number;
};
