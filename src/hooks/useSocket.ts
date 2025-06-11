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

		socket.emit("join_channel", channelId);

		socket.on("new_message", handleNewMessage);

		return () => {
			socket.emit("leave_channel", channelId);
			socket.off("new_message", handleNewMessage);
		};
	}, [channelId, queryClient]);
};
