export interface DirectMessage {
    id: number;
    content: string;
    senderId: number;
    receiverId: number;
    createdAt: string;
    updatedAt: string;
    sender: {
        id: number;
        username: string;
    };
    receiver?: {
        id: number;
        username: string;
    };
}

export interface SendDirectMessageData {
    content: string;
    receiverId: number;
}

export interface DMConversation {
    friend: {
        id: number;
        username: string;
    };
    latestMessage: {
        id: number;
        content: string;
        createdAt: string;
        senderId: number;
        senderUsername: string;
    } | null;
}

// Send a direct message
export const sendDirectMessage = async (
    data: SendDirectMessageData,
): Promise<{ directMessage: DirectMessage; message: string }> => {
    const response = await axiosInstance.post("/direct-messages/send", data);
    return response.data;
};

// Get conversation with a specific friend
export const getConversation = async (
    friendId: number,
): Promise<{ messages: DirectMessage[] }> => {
    const response = await axiosInstance.get(
        `/direct-messages/conversation/${friendId}`,
    );
    return response.data;
};

// Get all conversations
export const getAllConversations = async (): Promise<{
    conversations: DMConversation[];
}> => {
    const response = await axiosInstance.get("/direct-messages/conversations");
    return response.data;
};

// Delete a direct message
export const deleteDirectMessage = async (
    messageId: number,
): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(
        `/direct-messages/${messageId}`,
    );
    return response.data;
};

// React Query hooks
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

export const useGetConversation = (friendId: number) => {
    return useQuery({
        queryKey: ["directMessages", friendId],
        queryFn: () => getConversation(friendId),
        enabled: !!friendId,
    });
};

export const useGetAllConversations = () => {
    return useQuery({
        queryKey: ["dmConversations"],
        queryFn: getAllConversations,
    });
};

export const useSendDirectMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sendDirectMessage,
        onSuccess: (data) => {
            // Update the specific conversation
            queryClient.invalidateQueries({
                queryKey: ["directMessages", data.directMessage.receiverId],
            });
            // Update conversations list
            queryClient.invalidateQueries({ queryKey: ["dmConversations"] });
        },
    });
};

export const useDeleteDirectMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDirectMessage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["directMessages"] });
            queryClient.invalidateQueries({ queryKey: ["dmConversations"] });
        },
    });
};
