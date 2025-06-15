import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "..//socket";
import { Message } from "../types/servers";

export const useSocket = (channelId: number | undefined) => {
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!channelId) {
			return;
		}

		if (!socket.connected) {
			socket.connect();
			console.log("Connected");
		}

		const handleNewMessage = (newMessage: Message) => {
			queryClient.setQueryData<Message[]>(
				["channelMessages", channelId],
				(oldMessages = []) => {
					return [newMessage, ...oldMessages];
				}
			);
		};

        const handleDeletedMessage = (messageId: number) => {
			queryClient.setQueryData<Message[]>(
				["channelMessages", channelId],
				(oldMessages) => {
					if (!oldMessages) {
						return [];
					}

					return oldMessages.filter(
						(oldMessage) => oldMessage.id != messageId
					);
				}
			);
		};

		socket.emit("join_channel", channelId);

		socket.on("new_message", handleNewMessage);

        socket.on("deleted_message", handleDeletedMessage);

		return () => {
			socket.emit("leave_channel", channelId);
			socket.off("new_message", handleNewMessage);
            socket.off("deleted_message", handleDeletedMessage);
		};
	}, [channelId, queryClient]);
};
