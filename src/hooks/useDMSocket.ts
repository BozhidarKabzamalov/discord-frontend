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
			console.log("No current user, skipping DM socket setup");
			return;
		}

		if (!socket.connected) {
			socket.connect();
			console.log("Connected to DM socket");
		}

		const handleNewDirectMessage = (data: { directMessage: DirectMessage }) => {
			const message = data.directMessage;
			console.log("Received new DM:", message);
			
			// Determine the other user ID for the conversation
			const otherUserId = message.senderId === currentUser.id ? message.receiverId : message.senderId;
			console.log("Updating conversation for user:", otherUserId);
			
			// Update the conversation query data
			queryClient.setQueryData<{ messages: DirectMessage[] }>(
				["directMessages", otherUserId],
				(oldData) => {
					console.log("Current conversation data:", oldData);
					if (!oldData) {
						return { messages: [message] };
					}
					// Check if message already exists to prevent duplicates
					const messageExists = oldData.messages.some(m => m.id === message.id);
					if (messageExists) {
						console.log("Message already exists, skipping");
						return oldData;
					}
					console.log("Adding new message to conversation");
					return {
						messages: [...oldData.messages, message]
					};
				}
			);

			// Update conversations list to show the latest message
			queryClient.invalidateQueries({ queryKey: ["dmConversations"] });
		};

		// Join the user's DM room
		console.log("Joining DM room for user:", currentUser.id);
		socket.emit("join_dm", currentUser.id);

		// Listen for new direct messages
		socket.on("new_direct_message", handleNewDirectMessage);

		return () => {
			console.log("Leaving DM room for user:", currentUser.id);
			socket.emit("leave_dm", currentUser.id);
			socket.off("new_direct_message", handleNewDirectMessage);
		};
	}, [currentUser, queryClient]);
};