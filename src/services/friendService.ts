export interface FriendRequest {
    id: number;
    senderId: number;
    receiverId: number;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
    updatedAt: string;
    sender: {
        id: number;
        username: string;
    };
    receiver: {
        id: number;
        username: string;
    };
}

export interface Friend {
    id: number;
    username: string;
    isOnline?: boolean;
}

export interface SendFriendRequestData {
    username: string;
}

// Send a friend request
export const sendFriendRequest = async (
    data: SendFriendRequestData,
): Promise<{ friendRequest: FriendRequest; message: string }> => {
    const response = await axiosInstance.post("/friend-requests/send", data);
    return response.data;
};

// Accept a friend request
export const acceptFriendRequest = async (
    requestId: number,
): Promise<{ friendship: any; message: string }> => {
    const response = await axiosInstance.put(
        `/friend-requests/${requestId}/accept`,
    );
    return response.data;
};

// Reject a friend request
export const rejectFriendRequest = async (
    requestId: number,
): Promise<{ message: string }> => {
    const response = await axiosInstance.put(
        `/friend-requests/${requestId}/reject`,
    );
    return response.data;
};

// Get pending friend requests (received)
export const getPendingFriendRequests = async (): Promise<{
    pendingRequests: FriendRequest[];
}> => {
    const response = await axiosInstance.get("/friend-requests/pending");
    return response.data;
};

// Get sent friend requests
export const getSentFriendRequests = async (): Promise<{
    sentRequests: FriendRequest[];
}> => {
    const response = await axiosInstance.get("/friend-requests/sent");
    return response.data;
};

// Get friends list
export const getFriends = async (): Promise<{ friends: Friend[] }> => {
    const response = await axiosInstance.get("/friend-requests/friends");
    return response.data;
};

// Remove a friend
export const removeFriend = async (
    friendId: number,
): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(
        `/friend-requests/friends/${friendId}`,
    );
    return response.data;
};

// React Query hooks
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

export const useGetPendingFriendRequests = () => {
    return useQuery({
        queryKey: ["friendRequests", "pending"],
        queryFn: getPendingFriendRequests,
    });
};

export const useGetSentFriendRequests = () => {
    return useQuery({
        queryKey: ["friendRequests", "sent"],
        queryFn: getSentFriendRequests,
    });
};

export const useGetFriends = () => {
    return useQuery({
        queryKey: ["friends"],
        queryFn: getFriends,
    });
};

export const useSendFriendRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sendFriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["friendRequests", "sent"],
            });
        },
    });
};

export const useAcceptFriendRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: acceptFriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["friendRequests", "pending"],
            });
            queryClient.invalidateQueries({ queryKey: ["friends"] });
            queryClient.invalidateQueries({ queryKey: ["dmConversations"] });
        },
    });
};

export const useRejectFriendRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rejectFriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["friendRequests", "pending"],
            });
        },
    });
};

export const useRemoveFriend = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeFriend,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["friends"] });
            queryClient.invalidateQueries({ queryKey: ["dmConversations"] });
        },
    });
};
