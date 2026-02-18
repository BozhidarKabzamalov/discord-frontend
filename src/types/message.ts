export type CreateMessagePayload = {
    channelId: number;
    content: string;
};

export type DeleteMessagePayload = {
    channelId: number;
    messageId: number;
};
