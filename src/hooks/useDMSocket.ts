import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../socket";
import { DirectMessage } from "../services/directMessageService";
import { useBoundStore } from "../stores/useBoundStore";

export const useDMSocket = () => {
    const queryClient = useQueryClient();
    const currentUser = useBoundStore((state) => state.authenticatedUser);

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        if (!socket.connected) {
            socket.connect();
        }

        const handleNewDirectMessage = (data: {
            directMessage: DirectMessage;
        }) => {
            const message = data.directMessage;

            const otherUserId =
                message.senderId === currentUser.id
                    ? message.receiverId
                    : message.senderId;

            queryClient.setQueryData<{ messages: DirectMessage[] }>(
                ["directMessages", otherUserId],
                (oldData) => {
                    if (!oldData) {
                        return { messages: [message] };
                    }

                    const messageExists = oldData.messages.some(
                        (m) => m.id === message.id,
                    );

                    if (messageExists) {
                        console.log("Message already exists, skipping");
                        return oldData;
                    }

                    return {
                        messages: [...oldData.messages, message],
                    };
                },
            );

            queryClient.invalidateQueries({ queryKey: ["dmConversations"] });
        };

        socket.emit("join_dm", currentUser.id);

        socket.on("new_direct_message", handleNewDirectMessage);

        return () => {
            socket.emit("leave_dm", currentUser.id);
            socket.off("new_direct_message", handleNewDirectMessage);
        };
    }, [currentUser, queryClient]);
};
