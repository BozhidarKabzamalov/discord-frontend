import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../socket";
import { DirectMessage } from "../services/directMessageService";
import { useBoundStore } from "../stores/useBoundStore";

export const useDMSocket = () => {
	const queryClient = useQueryClient();
	const currentUser = useBoundStore(state => state.authenticatedUser);

	useEffect(() => {
		if (!currentUser) {
			return;
		}

		if (!socket.connected) {
			socket.connect();
			console.log("Connected to DM socket");
		}

		const handleNewDirectMessage = (data: { directMessage: DirectMessage }) => {
			const message = data.directMessage;
			
			// Update the specific conversation query
			const otherUserId = message.senderId === currentUser.id ? message.receiverId : message.senderId;
			
			queryClient.setQueryData<{ messages: DirectMessage[] }>(
				["directMessages", otherUserId],
				(oldData) => {
					if (!oldData) {
						return { messages: [message] };
					}
					return {
						messages: [...oldData.messages, message]
					};
				}
			);

			// Update conversations list
			queryClient.invalidateQueries({ queryKey: ["dmConversations"] });
		};

		// Join the user's DM room
		socket.emit("join_dm", currentUser.id);

		// Listen for new direct messages
		socket.on("new_direct_message", handleNewDirectMessage);

		return () => {
			socket.emit("leave_dm", currentUser.id);
			socket.off("new_direct_message", handleNewDirectMessage);
		};
	}, [currentUser, queryClient]);
};