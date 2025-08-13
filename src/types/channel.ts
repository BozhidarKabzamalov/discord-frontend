export enum ChannelType {
  TEXT = 'TEXT',
  VOICE = 'VOICE'
}

export type CreateChannelPayload = {
  name: string;
  type: ChannelType;
  serverId: number;
  categoryId: number | null;
};

export type DeleteChannelPayload = {
  serverId: number;
  channelId: number;
};

export type UpdateChannelPayload = {
  name: string;
  serverId: number;
  channelId: number;
};
