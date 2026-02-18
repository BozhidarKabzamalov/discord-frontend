import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { Message } from "../types/servers";
import { CreateMessagePayload, DeleteMessagePayload } from "../types/message";

export const getChannelMessages = async (channelId: number) => {
    try {
        const { data } = await axiosInstance.get<{ messages: Message[] }>(
            `/channels/${channelId}/messages`,
        );

        return data.messages;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const useGetChannelMessages = (channelId: number) => {
    return useQuery({
        queryKey: ["channelMessages", channelId],
        queryFn: () => getChannelMessages(channelId),
    });
};

export const createChannelMessage = async (payload: CreateMessagePayload) => {
    try {
        const { channelId, content } = payload;

        await axiosInstance.post(`/channels/${channelId}/messages`, {
            content,
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteChannelMessage = async (payload: DeleteMessagePayload) => {
    try {
        const { channelId, messageId } = payload;

        return await axiosInstance.delete(
            `/channels/${channelId}/messages/${messageId}`,
        );
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const useDeleteChannelMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteChannelMessage,
        onSuccess: (_data, variables) => {
            const { channelId, messageId } = variables;

            queryClient.setQueryData<Message[]>(
                ["channelMessages", channelId],
                (oldMessages) => {
                    if (!oldMessages) {
                        return [];
                    }

                    return oldMessages.filter(
                        (oldMessage) => oldMessage.id !== messageId,
                    );
                },
            );
        },
    });
};
